import styles from '@/styles/userProfile/header.module.scss';
import { UserInfos } from 'global';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BiBlock } from 'react-icons/bi';

interface IName {
  FirstName: string;
  LastName: string;
  Username: string;
  initialIsBlocked: boolean;
  toggleBlockStatus: () => void;
}

export default function Name({ FirstName, LastName, Username, initialIsBlocked, toggleBlockStatus }: IName) {
  const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
  const [cookies] = useCookies();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfos | undefined>(undefined);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (!router.isReady) return;

    const fetchUserInfo = async () => {
      try {
        const statusResponse = await fetch(
          `http://localhost:4000/friendship/getRelationship?requesterName=${encodeURIComponent(
            jwtDecode(cookies['jwt']).username
          )}&addresseeName=${router.query.username}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + cookies['jwt'],
            },
          }
        );

        const status = await statusResponse.text();
        if (status === 'BLOCKED') {
          setIsBlocked(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, [router.isReady, router.query.username, router, cookies]);

  const toggleBlock = async () => {
    let blockString = isBlocked ? 'unblock' : 'block';
    try {
      const response = await fetch(
        `http://localhost:4000/friendship/${blockString}?requesterName=${encodeURIComponent(
          jwtDecode(cookies['jwt']).username
        )}&addresseeName=${router.query.username}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + cookies['jwt'],
          },
        }
      );

      const status = await response.text();
      if (status === 'BLOCKED') {
        setIsBlocked(true);
      }
      if (response.ok) {
        setIsBlocked(!isBlocked);
        toggleBlockStatus();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.id_container}>
      <p className={styles.fullname}>
        {FirstName + ' ' + LastName}
        <span
          className={`${styles.blockIcon} ${isBlocked ? styles.blocked : ''}`}
          onClick={toggleBlock}
        >
          <BiBlock size={20} color={isBlocked ? 'red' : 'black'} />
        </span>
      </p>
      <p className={styles.username}>{'@' + Username}</p>
    </div>
  );
}
