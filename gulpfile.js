const gulp = require('gulp');
const uglyjs = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const { spawnSync } = require('child_process');

gulp.task('clean:dist', async () => {
  await del(['dist']);
});

gulp.task('build:ts', async () => {
  const { dest } = gulp;
  await tsProject.src()
    .pipe(tsProject())
    .js.pipe(uglyjs())
    .pipe(dest("dist/build"));
});

gulp.task('build:lib', async () => {
  const { src, dest } = gulp;
  await spawnSync('npm', ['run', 'lib'], { shell: true });
  await src('package.publish.json').pipe(rename('package.json')).pipe(dest('dist'));
});

gulp.task('dev:build', async () => {
  const { dest } = gulp;
  await tsProject.src()
    .pipe(tsProject())
    .pipe(dest("dist/build"));
});

gulp.task('dev', gulp.series('dev:build'));

gulp.task('default', gulp.series('clean:dist', 'build:lib'));
