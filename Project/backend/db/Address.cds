using Student from './Student';
using Id from './Student';

		entity Address {
		    key adid : Id;
		    stid : String(4);
		    city : String(100);
		    strt : String(100);
		    hnum : Integer;
		};
