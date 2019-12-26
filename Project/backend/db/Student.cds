type Id : String(4);
using Subject from './Subject';
using Address from './Address';

entity Student {
    key stid : Id;
    name : String(100);

    toSubject : association to many Subject on toSubject.stid = stid;
    toAddress : association to one Address on toAddress.stid = stid;
};
