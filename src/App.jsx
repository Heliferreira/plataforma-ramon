import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { AuthProvider as SupabaseAuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import { ActivitiesProvider } from '@/contexts/ActivitiesContext';
import { ContentProvider } from '@/contexts/ContentContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { EventsProvider } from '@/contexts/EventsContext';
import { CommunityProvider } from '@/contexts/CommunityContext';
import { CalendarProvider } from '@/contexts/CalendarContext';
import { Loader2 } from 'lucide-react';

const HomePage = lazy(() => import('@/pages/HomePage'));
const RodrigoLeitePage = lazy(() => import('@/pages/RodrigoLeitePage'));
const SobreMentoriaPage = lazy(() => import('@/pages/SobreMentoriaPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const DepoimentosPage = lazy(() => import('@/pages/DepoimentosPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));

const StudentDashboardPage = lazy(() => import('@/pages/student/StudentDashboardPage'));
const StudentProfilePage = lazy(() => import('@/pages/student/StudentProfilePage'));
const StudentCoursesPage = lazy(() => import('@/pages/student/StudentCoursesPage'));
const StudentCourseDetailPage = lazy(() => import('@/pages/student/StudentCourseDetailPage'));
const StudentLessonPage = lazy(() => import('@/pages/student/StudentLessonPage'));
const StudentActivitiesPage = lazy(() => import('@/pages/student/StudentActivitiesPage'));
const StudentCalendarPage = lazy(() => import('@/pages/student/StudentCalendarPage'));
const StudentEventsPage = lazy(() => import('@/pages/student/StudentEventsPage'));
const StudentMentorshipActivitiesPage = lazy(() => import('@/pages/student/StudentMentorshipActivitiesPage'));
const StudentCommunityPage = lazy(() => import('@/pages/student/StudentCommunityPage'));
const StudentCommunityProfilePage = lazy(() => import('@/pages/student/StudentCommunityProfilePage'));

const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage.jsx'));
const AdminContentPage = lazy(() => import('@/pages/admin/AdminContentPage.jsx'));
const AdminMentorshipActivitiesPage = lazy(() => import('@/pages/admin/AdminMentorshipActivitiesPage.jsx'));
const AdminGeneralActivitiesPage = lazy(() => import('@/pages/admin/AdminGeneralActivitiesPage.jsx'));
const AdminEventsPage = lazy(() => import('@/pages/admin/AdminEventsPage.jsx'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage.jsx'));


const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.profile?.role !== 'admin') {
    return <Navigate to="/student/profile" replace />;
  }
  
  return children;
};


const AnimatedRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Layout><Suspense fallback={<PageLoader />}><HomePage /></Suspense></Layout>} />
        <Route path="/rodrigo-leite" element={<Layout><Suspense fallback={<PageLoader />}><RodrigoLeitePage /></Suspense></Layout>} />
        <Route path="/sobre-a-mentoria" element={<Layout><Suspense fallback={<PageLoader />}><SobreMentoriaPage /></Suspense></Layout>} />
        <Route path="/sobre-nos" element={<Layout><Suspense fallback={<PageLoader />}><AboutPage /></Suspense></Layout>} />
        <Route path="/depoimentos" element={<Layout><Suspense fallback={<PageLoader />}><DepoimentosPage /></Suspense></Layout>} />
        <Route path="/blog" element={<Layout><Suspense fallback={<PageLoader />}><BlogPage /></Suspense></Layout>} />
        <Route path="/contato" element={<Layout><Suspense fallback={<PageLoader />}><ContactPage /></Suspense></Layout>} />
        
        <Route path="/login" element={<Layout><Suspense fallback={<PageLoader />}><AuthPage mode="login" /></Suspense></Layout>} />
        
        <Route path="/student/dashboard" element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><StudentDashboardPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><StudentProfilePage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><StudentCoursesPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/student/course/:courseId" element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><StudentCourseDetailPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/student/course/:courseId/lesson/:lessonId" element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><StudentLessonPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/student/activities" element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><StudentActivitiesPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/student/calendar" element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><StudentCalendarPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/student/events" element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><StudentEventsPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/student/mentorship-activities" element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><StudentMentorshipActivitiesPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/student/community" element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><StudentCommunityPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/student/community/:userId" element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><StudentCommunityProfilePage /></Suspense></Layout></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><Layout><Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><Layout><Suspense fallback={<PageLoader />}><AdminUsersPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute adminOnly={true}><Layout><Suspense fallback={<PageLoader />}><AdminContentPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/admin/mentorship-activities" element={<ProtectedRoute adminOnly={true}><Layout><Suspense fallback={<PageLoader />}><AdminMentorshipActivitiesPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/admin/general-activities" element={<ProtectedRoute adminOnly={true}><Layout><Suspense fallback={<PageLoader />}><AdminGeneralActivitiesPage /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/admin/events" element={<ProtectedRoute adminOnly={true}><Layout><Suspense fallback={<PageLoader />}><AdminEventsPage /></Suspense></Layout></ProtectedRoute>} />
        
        <Route path="*" element={<Layout><Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense></Layout>} />
      </Routes>
    </AnimatePresence>
  );
}


function App() {
  return (
    <Router>
      <SupabaseAuthProvider>
        <ActivitiesProvider>
          <ContentProvider>
            <ProgressProvider>
              <EventsProvider>
                <CommunityProvider>
                  <CalendarProvider>
                    <AnimatedRoutes />
                  </CalendarProvider>
                </CommunityProvider>
              </EventsProvider>
            </ProgressProvider>
          </ContentProvider>
        </ActivitiesProvider>
      </SupabaseAuthProvider>
    </Router>
  );
}

export default App;