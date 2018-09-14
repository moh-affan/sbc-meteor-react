import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import {renderRoutes} from '../imports/startup/routes';

//import './main.html';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('root'));
  $('body').addClass('skin-blue');
  import '../imports/ui/AdminLTE.js';
});
