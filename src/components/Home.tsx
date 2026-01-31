/* GENERATED: MD3 Platinum Recovery — DO NOT EDIT MANUALLY */

import React, { useState, useEffect, useCallback } from 'react';
import { M3Typography, M3Button, M3Card } from './ui/index';

interface Lesson {
  id: string;
  subject: string;
  time: string;
  classroom: string;
  students: number;
}

interface HomeProps {
  teacherName?: string;
  onStartDay?: () => void;
  fullWidth?: boolean;
  label?: string;
  onClick?: () => void;
  onNavigateToLesson?: (lessonId: string) => void;
  onNavigateToTimetable?: () => void;
}

export const Home: React.FC<HomeProps> = ({
  teacherName = 'Docente',
  onStartDay,
  fullWidth = true,
  onNavigateToLesson,
  onNavigateToTimetable
}) => {
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate fetching next lesson data
  const fetchNextLesson = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - in real app this would come from API
      const mockLesson: Lesson = {
        id: 'math-101',
        subject: 'Matematica',
        time: '10:00 - 11:00',
        classroom: 'Aula 12',
        students: 25
      };

      setNextLesson(mockLesson);
    } catch (err) {
      setError('Errore nel caricamento della prossima lezione');
      console.error('Error fetching next lesson:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchNextLesson();
  }, [fetchNextLesson]);

  const handleStartDay = useCallback(() => {
    if (onStartDay) {
      onStartDay();
    }
  }, [onStartDay]);

  const handleLessonClick = useCallback(() => {
    if (nextLesson && onNavigateToLesson) {
      onNavigateToLesson(nextLesson.id);
    }
  }, [nextLesson, onNavigateToLesson]);

  const handleTimetableClick = useCallback(() => {
    if (onNavigateToTimetable) {
      onNavigateToTimetable();
    }
  }, [onNavigateToTimetable]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit' // eslint-disable-line design-system/no-hardcoded-layout-values
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Buongiorno';
    if (hour < 18) return 'Buon pomeriggio';
    return 'Buonasera';
  };

  return (
    <div
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: 'var(--md-sys-spacing-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-4)',
        backgroundColor: 'var(--md-sys-color-surface)',
        color: 'var(--md-sys-color-on-surface)',
        minHeight: 'var(--md-sys-sizing-full)'
      }}
    >
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <M3Typography variant="headline-large">
            {getGreeting()}, {teacherName}
          </M3Typography>
          <M3Typography variant="body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 'var(--md-sys-spacing-1)' }}>
            {currentTime.toLocaleDateString('it-IT', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </M3Typography>
        </div>
        <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          {formatTime(currentTime)}
        </M3Typography>
      </div>

      {/* Main Content */}
      <M3Typography variant="body-large">
        Dashboard principale per gestire le tue attività didattiche.
      </M3Typography>

      {/* Next Lesson Card */}
      <M3Card
        title={isLoading ? 'Caricamento...' : nextLesson ? 'Prossima lezione' : 'Nessuna lezione pianificata'}
        content={
          isLoading
            ? 'Recupero informazioni sulla prossima lezione...'
            : nextLesson
              ? `${nextLesson.subject} • ${nextLesson.time} • ${nextLesson.classroom} • ${nextLesson.students} studenti`
              : 'Non ci sono lezioni programmate per oggi. Controlla il tuo orario.'
        }
        onClick={nextLesson ? handleLessonClick : undefined}
        variant={nextLesson ? 'elevated' : 'outlined'}
        isLoading={isLoading}
        error={error}
      />

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-3)', flexWrap: 'wrap' }}>
        <M3Button
          variant="filled"
          onClick={handleStartDay}
          style={{ flex: '1', minWidth: 'var(--md-sys-spacing-24)' }}
        >
          Inizia Giornata
        </M3Button>
        <M3Button
          variant="outlined"
          onClick={handleTimetableClick}
          style={{ flex: '1', minWidth: 'var(--md-sys-spacing-24)' }}
        >
          Visualizza Orario
        </M3Button>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-spacing-20), var(--md-sys-sizing-full)))',
        gap: 'var(--md-sys-spacing-3)',
        marginTop: 'var(--md-sys-spacing-4)'
      }}>
        <M3Card
          title="Lezioni Oggi"
          content="3 lezioni programmate"
          variant="filled"
        />
        <M3Card
          title="Studenti"
          content="156 studenti attivi"
          variant="filled"
        />
        <M3Card
          title="Compiti"
          content="12 da correggere"
          variant="filled"
        />
      </div>
    </div>
  );
};

// SNAPSHOT_PLACEHOLDER: Home component visual regression baseline
// TODO: Add Playwright snapshot test and link to [CHECKLIST.md](http://_vscodecontentref_/CHECKLIST.md) phase 3
