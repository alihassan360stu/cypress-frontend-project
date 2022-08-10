// const crypto = require('crypto');
// const ENC= 'bf3c199c2470cb477d907b1e0917c17b';
// const IV = "5183666c72eec9e4";
// const ALGO = "aes-256-cbc"

export default {
    // API_URL: 'http://localhost:3001/api',
    API_URL: window.location.origin + '/api/',
    TKV: '619F20AbgLLkkLL100!@!$%!ZX!##$$',
    ALGO: 'aes256',
    IMG_URL: window.location.origin + '/api',
    // IMG_URL: 'http://localhost:3001',
    COLORS: {
        RED: '',
        ORANGE: '',
        GREEN: ''
    },
    EMP_TYPES: [
        { id: 3, title: 'Permanent' },
        { id: 4, title: 'Temporary' },
        { id: 1, title: 'Daily Wages' },
        { id: 2, title: 'Hourly Wages' },
        { id: 5, title: 'Visiting' },
        { id: 6, title: 'Part Time' },
    ],
    NOTI_TYPES_NEW: {
        New_Update_Request: 1,
        Update_Request_Approved: 2,
        Update_Request_Rejected: 3,
        Criminal_Notification: 4,
        Disposal_Submitted: 5
    },
    NOTI_TYPES: [
        'New Update Request', //1
        'Update Request Approved', //2
        'Update Request Rejected', //3
        'Criminal Notification', //4
        'Disposal Submitted', //5
    ],
    NOTI_REQ_DELAY: 50000,
    GENDERS: [
        { id: 1, title: 'Male' },
        { id: 2, title: 'Female' },
        { id: 3, title: 'Transgender' },
    ],
    AGES: [
        { id: 1, title: 'Adult' },
        { id: 2, title: 'Minor' },
    ],
    EMP_REGISTERATION_FOR: [
        { id: 1, title: 'Association' },
        { id: 2, title: 'Company' },
    ],
    NOTIFICATION_FOR: {
        ADMIN: 1,
        ASSOC: 2,
        COMP: 3,
        SHOP: 4,
        HOTEL: 5,
        RANGE: 6,
        ZONE: 7,
        DISTRICT: 8,
        PS: 9,
        DISPOSAL_MASTER: 10
    },
}
