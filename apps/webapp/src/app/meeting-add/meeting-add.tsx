import { useNavigate } from 'react-router-dom';
import { Layout } from '../ui-elements/layout';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { v4 } from 'uuid';
import { useFirestore } from '../firebase/use-firestore';
import { doc, setDoc } from 'firebase/firestore';
import { Meeting } from '../meeting/meeting';
import { LoggerFactory } from '@consdata/logger-api';
import { useAuthentication } from '../auth/use-authentication';

const log = LoggerFactory.getLogger('MeetingAdd');

export const MeetingAdd = () => {
  const navigate = useNavigate();
  const db = useFirestore();
  const { state: auth } = useAuthentication();
  useEffect(() => {
    const id = v4();
    const meetingDoc = doc(db, 'meetings', id);
    if (!auth.user) {
      throw new Error(`Can't call without authenticated user`);
    }
    const meeting: Meeting = {
      id,
      slots: [],
      title: '',
      inviteId: v4(),
      locks: {},
      bookings: {},
      organizerName: auth.user.displayName,
    };
    setDoc(meetingDoc, meeting)
      .then(() => {
        log.info(`Stworzono wydarzenie: ${meetingDoc.id}`);
        navigate(`/meeting/edit/${meetingDoc.id}`, { replace: true });
      })
      .catch((error) => {
        log.error(error);
        alert('Błąd tworzenia wydarzenia');
      });
  }, [db, navigate, auth]);
  return (
    <Layout>
      <CircularProgress style={{ marginTop: '32px' }} />
    </Layout>
  );
};
