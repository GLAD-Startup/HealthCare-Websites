import React, { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import confetti from 'canvas-confetti';

import { db, initializeDatabase } from './db/dexie.ts';
import { syncEngine } from './services/syncEngine.ts';
import { sendWhatsAppMessage } from './services/whatsappService.ts';

import type { Customer, FollowUp, WhatsAppTemplate, WhatsAppLog } from './types/index.ts';

import { Header } from './components/Header.tsx';
import { Sidebar, type NavTab } from './components/Sidebar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { PatientsView } from './components/PatientsView.tsx';
import { FollowUpsView } from './components/FollowUpsView.tsx';
import { WhatsAppView } from './components/WhatsAppView.tsx';
import { PatientModal } from './components/PatientModal.tsx';
import { PatientDetailsDrawer } from './components/PatientDetailsDrawer.tsx';
import { FollowUpModal } from './components/FollowUpModal.tsx';
import { SyncDrawer } from './components/SyncDrawer.tsx';
import { SyncView } from './components/SyncView.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { ToastContainer, type ToastMessage } from './components/Toast.tsx';
import { useClinicalCounts } from './hooks/useClinicalCounts.ts';
import { formatDate } from './utils/formatters.ts';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<Customer | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Customer | null>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpPreselectedCustomer, setFollowUpPreselectedCustomer] = useState<Customer | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSyncDrawerOpen, setIsSyncDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [followUpsInitialTab, setFollowUpsInitialTab] = useState<'today' | 'overdue' | 'upcoming' | 'completed' | 'all'>('today');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize Dexie local database with seed data if needed
  useEffect(() => {
    initializeDatabase().then(() => {
      syncEngine.refreshPendingCount();
    });
  }, []);

  // Reactive Dexie Queries
  const rawCustomers = useLiveQuery(() => db.customers.toArray(), []);
  const rawFollowups = useLiveQuery(() => db.followups.toArray(), []);
  const isInitialLoading = rawCustomers === undefined || rawFollowups === undefined;
  const customers = rawCustomers || [];
  const followups = rawFollowups || [];
  const templates = useLiveQuery(() => db.templates.toArray(), []) || [];
  const whatsappLogs = useLiveQuery(() => db.whatsappLogs.reverse().toArray(), []) || [];
  const syncQueue = useLiveQuery(() => db.syncQueue.toArray(), []) || [];

  const clinicalCounts = useClinicalCounts(customers, followups);
  const followUpsBadgeCount = clinicalCounts.needsAttentionCount;
  const hasOverdueFollowUps = clinicalCounts.hasOverdue;
  const pendingSyncCount = syncQueue.filter((q) => q.status === 'pending' || q.status === 'failed').length;

  // Unified Toast Helper with Undo Action Support
  const showToast = useCallback((
    text: string, 
    type: 'success' | 'error' | 'info' = 'info',
    action?: { label: string; onClick: () => void }
  ) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type, action }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, action ? 6500 : 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Trigger Handler
  const handleTriggerSync = async () => {
    const res = await syncEngine.syncNow();
    if (res.success) {
      showToast(res.message, 'success');
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.1 } });
    } else {
      showToast(res.message, 'error');
    }
  };

  // Create or Update Patient
  const handleSavePatient = async (patientData: Partial<Customer>) => {
    const now = new Date().toISOString();

    if (patientToEdit) {
      // UPDATE
      const updatedCustomer: Customer = {
        ...patientToEdit,
        ...patientData,
        updatedAt: now,
        syncStatus: 'pending',
      } as Customer;

      await db.customers.put(updatedCustomer);
      await syncEngine.queueChange('customer', updatedCustomer.id, 'UPDATE', updatedCustomer);

      if (selectedPatient?.id === updatedCustomer.id) {
        setSelectedPatient(updatedCustomer);
      }

      showToast(`Updated profile for ${updatedCustomer.name}.`, 'success');
    } else {
      // CREATE
      const newCustomer: Customer = {
        id: 'cust-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
        name: patientData.name || 'Patient',
        phone: patientData.phone || '',
        email: patientData.email,
        doctorAssigned: patientData.doctorAssigned || 'Dr. Vrindavan',
        category: patientData.category || 'General Consultation',
        createdAt: now,
        updatedAt: now,
        lastContact: null,
        nextFollowUp: patientData.nextFollowUp || null,
        followUpStatus: patientData.followUpStatus || 'pending',
        notes: patientData.notes || '',
        whatsappStatus: 'none',
        syncStatus: 'pending',
      };

      await db.customers.add(newCustomer);
      await syncEngine.queueChange('customer', newCustomer.id, 'CREATE', newCustomer);

      // If next follow-up date was set, also create a FollowUp record
      if (newCustomer.nextFollowUp) {
        const newFollowUp: FollowUp = {
          id: 'fol-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
          customerId: newCustomer.id,
          customerName: newCustomer.name,
          customerPhone: newCustomer.phone,
          date: newCustomer.nextFollowUp,
          status: 'pending',
          notes: newCustomer.notes || 'Initial consultation follow-up',
          reminderSent: false,
          createdAt: now,
          updatedAt: now,
          syncStatus: 'pending',
        };
        await db.followups.add(newFollowUp);
        await syncEngine.queueChange('followup', newFollowUp.id, 'CREATE', newFollowUp);
      }

      showToast(`Registered patient ${newCustomer.name} successfully!`, 'success');
    }
  };

  // Delete Patient
  const handleDeletePatient = async (patientId: string) => {
    const patient = customers.find((c) => c.id === patientId);
    if (!patient) return;

    if (confirm(`Are you sure you want to delete ${patient.name}'s records?`)) {
      await db.customers.delete(patientId);
      await db.followups.where('customerId').equals(patientId).delete();
      await syncEngine.queueChange('customer', patientId, 'DELETE', { id: patientId });

      if (selectedPatient?.id === patientId) {
        setSelectedPatient(null);
      }
      showToast(`Deleted patient ${patient.name}.`, 'info');
    }
  };

  // Schedule Follow-up
  const handleSaveFollowUp = async (customerId: string, date: string, notes: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    const now = new Date().toISOString();
    const newFollowUp: FollowUp = {
      id: 'fol-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      date,
      status: 'pending',
      notes,
      reminderSent: false,
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
    };

    await db.followups.add(newFollowUp);
    await syncEngine.queueChange('followup', newFollowUp.id, 'CREATE', newFollowUp);

    // Update customer nextFollowUp if closer or not set
    const updatedCustomer: Customer = {
      ...customer,
      nextFollowUp: date,
      followUpStatus: 'scheduled',
      updatedAt: now,
      syncStatus: 'pending',
    };
    await db.customers.put(updatedCustomer);
    await syncEngine.queueChange('customer', updatedCustomer.id, 'UPDATE', updatedCustomer);

    if (selectedPatient?.id === customer.id) {
      setSelectedPatient(updatedCustomer);
    }

    showToast(`Scheduled follow-up for ${customer.name} on ${date}.`, 'success');
  };

  // Mark Follow-up Complete with Undo Toast
  const handleMarkFollowUpComplete = async (followupId: string) => {
    const followup = followups.find((f) => f.id === followupId);
    if (!followup) return;

    const prevFollowUp = { ...followup };
    const customer = customers.find((c) => c.id === followup.customerId);
    const prevCustomerStatus = customer ? customer.followUpStatus : undefined;

    const now = new Date().toISOString();
    const updated: FollowUp = {
      ...followup,
      status: 'completed',
      updatedAt: now,
      syncStatus: 'pending',
    };

    await db.followups.put(updated);
    await syncEngine.queueChange('followup', updated.id, 'UPDATE', updated);

    // If customer has no more pending follow-ups, update customer status
    const remainingPending = followups.filter(
      (f) => f.customerId === followup.customerId && f.id !== followupId && f.status === 'pending'
    );
    if (remainingPending.length === 0) {
      if (customer) {
        const updatedCust: Customer = {
          ...customer,
          followUpStatus: 'completed',
          updatedAt: now,
          syncStatus: 'pending',
        };
        await db.customers.put(updatedCust);
        await syncEngine.queueChange('customer', updatedCust.id, 'UPDATE', updatedCust);
      }
    }

    showToast(
      `Marked follow-up for ${followup.customerName} as completed.`,
      'success',
      {
        label: 'Undo',
        onClick: async () => {
          const revertNow = new Date().toISOString();
          await db.followups.put({
            ...prevFollowUp,
            status: 'pending',
            updatedAt: revertNow,
            syncStatus: 'pending',
          });
          await syncEngine.queueChange('followup', prevFollowUp.id, 'UPDATE', {
            ...prevFollowUp,
            status: 'pending',
          });
          if (customer && prevCustomerStatus) {
            await db.customers.put({
              ...customer,
              followUpStatus: prevCustomerStatus,
              updatedAt: revertNow,
              syncStatus: 'pending',
            });
            await syncEngine.queueChange('customer', customer.id, 'UPDATE', {
              ...customer,
              followUpStatus: prevCustomerStatus,
            });
          }
          showToast(`Follow-up restored for ${followup.customerName}.`, 'info');
        },
      }
    );
  };

  // Reschedule Follow-up with Undo Toast
  const handleRescheduleFollowUp = async (followupId: string, newDate: string) => {
    const followup = followups.find((f) => f.id === followupId);
    if (!followup) return;

    const previousDate = followup.date;
    const customer = customers.find((c) => c.id === followup.customerId);
    const prevNextFollowUp = customer?.nextFollowUp;

    const now = new Date().toISOString();
    const updated: FollowUp = {
      ...followup,
      date: newDate,
      status: 'pending',
      updatedAt: now,
      syncStatus: 'pending',
    };

    await db.followups.put(updated);
    await syncEngine.queueChange('followup', updated.id, 'UPDATE', updated);

    // Update patient nextFollowUp
    if (customer) {
      const updatedCust: Customer = {
        ...customer,
        nextFollowUp: newDate,
        followUpStatus: 'scheduled',
        updatedAt: now,
        syncStatus: 'pending',
      };
      await db.customers.put(updatedCust);
      await syncEngine.queueChange('customer', updatedCust.id, 'UPDATE', updatedCust);
    }

    showToast(
      `Rescheduled follow-up to ${formatDate(newDate)}.`,
      'success',
      {
        label: 'Undo',
        onClick: async () => {
          const revertNow = new Date().toISOString();
          await db.followups.put({
            ...followup,
            date: previousDate,
            updatedAt: revertNow,
            syncStatus: 'pending',
          });
          await syncEngine.queueChange('followup', followup.id, 'UPDATE', {
            ...followup,
            date: previousDate,
          });
          if (customer && prevNextFollowUp) {
            await db.customers.put({
              ...customer,
              nextFollowUp: prevNextFollowUp,
              updatedAt: revertNow,
              syncStatus: 'pending',
            });
            await syncEngine.queueChange('customer', customer.id, 'UPDATE', {
              ...customer,
              nextFollowUp: prevNextFollowUp,
            });
          }
          showToast(`Reverted reschedule for ${followup.customerName}.`, 'info');
        },
      }
    );
  };

  // WhatsApp Message Dispatcher
  const handleSendWhatsApp = async ({
    customer,
    message,
    templateTitle,
    channel = 'wa_me',
  }: {
    customer: Customer;
    message: string;
    templateTitle?: string;
    channel?: 'wa_me' | 'cloud_api';
  }) => {
    const res = await sendWhatsAppMessage({
      customer,
      message,
      templateTitle,
      channel,
    });
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Quick WhatsApp trigger from list or dashboard
  const handleQuickWhatsAppTrigger = (customer: Customer, customMessage?: string) => {
    setFollowUpPreselectedCustomer(customer);
    if (customMessage) {
      sendWhatsAppMessage({
        customer,
        message: customMessage,
        templateTitle: 'Quick Follow-up',
      }).then((res) => {
        showToast(res.message, res.success ? 'success' : 'error');
      });
    } else {
      setCurrentTab('whatsapp');
    }
  };

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'patients':
        return 'Patients';
      case 'followups':
        return 'Follow-ups';
      case 'whatsapp':
        return 'WhatsApp';
      case 'sync':
        return 'Sync';
      default:
        return 'Clinic CRM';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A] antialiased">
      
      {/* Pinned Left-Edge Full-Height Sidebar (248px / 72px collapsed) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        followUpsBadgeCount={followUpsBadgeCount}
        hasOverdueFollowUps={hasOverdueFollowUps}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSyncDrawer={() => setIsSyncDrawerOpen(true)}
      />

      {/* Main Column Filling The Rest (no left gutter) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Bar (64px, white, bottom border) */}
        <Header
          pageTitle={getPageTitle()}
          customers={customers}
          onSelectPatient={(p) => setSelectedPatient(p)}
          onOpenNewPatient={() => {
            setPatientToEdit(null);
            setIsPatientModalOpen(true);
          }}
          onOpenNewFollowUp={() => {
            setFollowUpPreselectedCustomer(null);
            setIsFollowUpModalOpen(true);
          }}
          onOpenNewWhatsApp={() => {
            setCurrentTab('whatsapp');
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenSyncDrawer={() => setIsSyncDrawerOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onTriggerSync={handleTriggerSync}
        />

        {/* Dynamic Main View - max width ~1280px, 32px side padding */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
          <div className="max-w-[1280px] w-full mx-auto p-4 sm:p-6 lg:p-8">
            {currentTab === 'dashboard' && (
              <Dashboard
                customers={customers}
                followups={followups}
                isLoading={isInitialLoading}
                onOpenNewPatient={() => {
                  setPatientToEdit(null);
                  setIsPatientModalOpen(true);
                }}
                onOpenNewFollowUp={() => {
                  setFollowUpPreselectedCustomer(null);
                  setIsFollowUpModalOpen(true);
                }}
                onNavigateToTab={(tab, filter) => {
                  if (filter) {
                    setFollowUpsInitialTab(filter as any);
                  }
                  setCurrentTab(tab as NavTab);
                }}
                onSelectPatient={(p) => setSelectedPatient(p)}
                onSendWhatsApp={handleQuickWhatsAppTrigger}
                onMarkFollowUpComplete={handleMarkFollowUpComplete}
              />
            )}

            {currentTab === 'patients' && (
              <PatientsView
                customers={customers}
                isLoading={isInitialLoading}
                onOpenNewPatient={() => {
                  setPatientToEdit(null);
                  setIsPatientModalOpen(true);
                }}
                onSelectPatient={(p) => setSelectedPatient(p)}
                onEditPatient={(p) => {
                  setPatientToEdit(p);
                  setIsPatientModalOpen(true);
                }}
                onDeletePatient={handleDeletePatient}
                onSendWhatsApp={handleQuickWhatsAppTrigger}
                onScheduleFollowUp={(p) => {
                  setFollowUpPreselectedCustomer(p);
                  setIsFollowUpModalOpen(true);
                }}
              />
            )}

            {currentTab === 'followups' && (
              <FollowUpsView
                followups={followups}
                customers={customers}
                initialTab={followUpsInitialTab}
                isLoading={isInitialLoading}
                onOpenNewFollowUp={() => {
                  setFollowUpPreselectedCustomer(null);
                  setIsFollowUpModalOpen(true);
                }}
                onMarkFollowUpComplete={handleMarkFollowUpComplete}
                onRescheduleFollowUp={handleRescheduleFollowUp}
                onSendWhatsApp={handleQuickWhatsAppTrigger}
                onSelectPatient={(p) => setSelectedPatient(p)}
              />
            )}

            {currentTab === 'whatsapp' && (
              <WhatsAppView
                customers={customers}
                templates={templates}
                whatsappLogs={whatsappLogs}
                preselectedCustomer={followUpPreselectedCustomer}
                onSendMessage={handleSendWhatsApp}
                onSaveTemplate={async (tmpl) => {
                  await db.templates.put(tmpl as WhatsAppTemplate);
                  showToast('Template saved successfully!', 'success');
                }}
              />
            )}

            {currentTab === 'sync' && (
              <SyncView
                onTriggerSync={handleTriggerSync}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Slide-over Patient Details Drawer */}
      <PatientDetailsDrawer
        patient={selectedPatient}
        followups={followups}
        whatsappLogs={whatsappLogs}
        onClose={() => setSelectedPatient(null)}
        onEditPatient={(p) => {
          setPatientToEdit(p);
          setIsPatientModalOpen(true);
        }}
        onSendWhatsApp={handleQuickWhatsAppTrigger}
        onAddFollowUp={async (patient, date, notes) => {
          await handleSaveFollowUp(patient.id, date, notes);
        }}
        onMarkFollowUpComplete={handleMarkFollowUpComplete}
      />

      {/* Patient Add / Edit Modal */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => {
          setIsPatientModalOpen(false);
          setPatientToEdit(null);
        }}
        onSave={handleSavePatient}
        patientToEdit={patientToEdit}
      />

      {/* Follow-up Scheduler Modal */}
      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => {
          setIsFollowUpModalOpen(false);
          setFollowUpPreselectedCustomer(null);
        }}
        customers={customers}
        preselectedCustomer={followUpPreselectedCustomer}
        onSave={handleSaveFollowUp}
      />

      {/* Sync Queue Drawer */}
      <SyncDrawer
        isOpen={isSyncDrawerOpen}
        onClose={() => setIsSyncDrawerOpen(false)}
        onTriggerSync={handleTriggerSync}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Clinic Settings & Database Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsSaved={() => {
          showToast('Settings updated.', 'info');
        }}
        onShowToast={showToast}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
