import 'babel-polyfill';
import gulp from 'gulp';
// import repl from 'repl';
// import gutil from 'gulp-util';

// import init from './src/init';
import startServer from './src';

// gulp.task('console', () => {
//   gutil.log = gutil.noop;
//   const replServer = repl.start({
//     prompt: 'Application console > ',
//   });

// });

// gulp.task('init', async () => {
//   await init(true);
//   // console.log('db created');
// });

gulp.task('server', () =>
  startServer().listen(process.env.PORT || 3000));
