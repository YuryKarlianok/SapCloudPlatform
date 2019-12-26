using Student from './Student';
using Id from './Student';


		entity Subject {
		    key suid : Id;
		    stid : String(4);
		    name : String(100);

    		toStudent : association to one Student on toStudent.stid = stid;
		};
