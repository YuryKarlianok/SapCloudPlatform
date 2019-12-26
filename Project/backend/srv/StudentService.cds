using Student as _Student from '../db/Student';
using Address as _Address from '../db/Address';
using Subject as _Subject from '../db/Subject';

service odata {

  entity Student @(
		title: 'Student'
	) as projection on _Student;

  entity Address @(
		title: 'Address'
	) as projection on _Address;

  entity Subject @(
		title: 'Subject'
	) as projection on _Subject;

}
