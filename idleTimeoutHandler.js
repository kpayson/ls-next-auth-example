import React, { useEffect, useState, useRef } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import moment from 'moment';
import { IdleTimeOutModal } from './IdleTimeOutModal';
import { getToken } from "next-auth/jwt";
//import { getSession } from "next-auth/client";


const IdleTimeOutHandler = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [isLogout, setLogout] = useState(false);
    const { data: session, status } = useSession();
    let timer;
    const events = ['click', 'load', 'keydown'];

    let _showMe = false;
    const showMe = ()=>{
        return _showMe;
    }
    const setShowMe = (v)=>{
        _showMe = v;
    }
    const showModalRef = useRef(showModal);
    const eventHandler = (eventType) => {

        console.log(eventType);
        if (!isLogout) {
            localStorage.setItem('lastInteractionTime', moment());
            if (timer) {
                props.onActive();
                startTimer();
            }
        }

    };

    function makeAuthenticatedRequest(url, options = {}) {
        // const session = await getSession();
        // if (!session) {
        //   throw new Error("No active session found.")
        // }
        const token = session.accessToken; //await getToken();
      
        const headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      
        //const response = await fetch(url, { ...options, headers });
        return response;
      }

    useEffect(() => {
        addEvents();

        return (() => {

            removeEvents();
            clearTimeout(timer);
        });
    }, []);

    const startTimer = () => {

        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {

            let lastInteractionTime = localStorage.getItem('lastInteractionTime');
            const diff = moment.duration(moment().diff(moment(lastInteractionTime)));
            let timeOutInterval = props.timeOutInterval ? props.timeOutInterval : 10 * 60 * 1000;
            if (isLogout) {
                clearTimeout(timer);
            } else {
                if (diff._milliseconds < timeOutInterval) {
                    startTimer();
                    props.onActive();
                } else {
                    props.onIdle();
                    setShowModal(true);
                    setShowMe(true);
                    window.setTimeout(()=>{
                        if(showMe()) { //showModalRef.current
                            setShowModal(false);
                            setShowMe(false);
                            handleLogout();
                        }
                    },60000); //auto timeout after one minute
                }
            }

        }, props.timeOutInterval ? props.timeOutInterval : 6000);





    };
    const addEvents = () => {

        events.forEach(eventName => {
            window.addEventListener(eventName, eventHandler);
        });

        startTimer();
    };

    const removeEvents = () => {
        events.forEach(eventName => {
            window.removeEventListener(eventName, eventHandler);
        });
    };

    const handleContinueSession = () => {
        setShowModal(false);
        // '/auth/admin/tenants/sessions/sessionExtend'
        // makeAuthenticatedRequest(`${process.env.LABSHARE_BASEPATH}/auth/admin/tenants/sessions/sessionExtend`).then(res=>{
        //     console.log(res);
        // });
        // getToken().then(tkn=>{
        //     console.log(tkn);
        // });
        //setLogout(false);
    };
    const handleLogout = () => {
        removeEvents();
        clearTimeout(timer);
        setLogout(true);
        props.onLogout();
        setShowModal(false);
        setShowMe(false);

    };

    return (
        <div>

            <IdleTimeOutModal
                showModal={showModal}
                handleContinue={handleContinueSession}
                handleLogout={handleLogout}
            />

        </div>
    );

}

export default IdleTimeOutHandler;