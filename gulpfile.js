var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var express = require('express');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var rev = require('gulp-rev');
var rename = require('gulp-rename');
var tiny_lr = require('tiny-lr');
var webpack = require('webpack');

/**
 * Configs
 */

var webpackConfig = require('./webpack.config.js');
if (gulp.env.production) {
  // we executed with a --production option
  webpackConfig.plugins = webpackConfig.plugins.concat(new webpack.optimize.UglifyJsPlugin());
  webpackConfig.output.filename = "main-[hash].js";

}

var sassConfig = { includePaths: ['src/styles'] };
httpPort = 3000;
// paths to files in lib that should be copied to dist/assets/vendr
vendorPaths = ['es5-shim/es5-sham.js', 'es5-shim/es5-shim.js', 'bootstrap/dist/css/bootstrap.css'];

/**
 * Tasks
 */

gulp.task('clean', function() {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

// main.scss should @include any other css you want
gulp.task('sass', function() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass(sassConfig).on('error', gutil.log))
    .pipe(gulp.env.production ? minifyCSS() : gutil.noop())
    .pipe(gulp.env.production ? rev() : gutil.noop())
    .pipe(gulp.dest('dist/assets'));
});

// vendor js and css files
gulp.task('vendor', function() {
  var paths = vendorPaths.map(function(p) { return path.resolve('./lib', p); });
  return gulp.src(paths)
    .pipe(gulp.dest('dist/assets/vendor'));
});

// copy remaining assets to dist
gulp.task('copy', function() {
  var paths = ['src/**/*', '!src/scripts', '!src/scripts/**/*', '!src/styles', '!src/styles/**/*'];
  if (!gulp.env.production) {
    paths.push('!src/_package.json');
  }
  return gulp.src(paths)
    .pipe(gulp.env.production ? rename(distPackage) : gutil.noop())
    .pipe(gulp.dest('dist'));
});

// webpack precompile
// uglifies when in production mode
gulp.task('webpack', function(callback) {
  execWebpack(webpackConfig);
  callback();
});

gulp.task('dev', ['build'], function() {
  var servers = createServers(httpPort, 35729);
  // when /src changes, fire off a rebuild
  gulp.watch(['src/**/*'], function(evt) {
    gulp.run('build');
  });

  // when /dist changes, tell the browser to reload
  gulp.watch(['dist/**/*'], function(evt) {
    gutil.log(gutil.colors.cyan(evt.path), 'changed');
    servers.lr.changed({
      body: {
        files: [evt.path]
      }
    });
  });
});

gulp.task('build', ['webpack', 'sass', 'copy', 'vendor'], function() {});

gulp.task('default', ['build'], function() {
  // give first-time users a little help
  setTimeout(function() {
    gutil.log("**********************************************");
    gutil.log("* gulp              (development build)");
    gutil.log("* gulp clean        (rm /dist)");
    gutil.log("* gulp --production (production build)");
    gutil.log("* gulp dev          (build and run dev server)");
    return gutil.log("**********************************************");
  }, 3000);
});

/**
 * Helpers
 */

// Create both http server and livereload server
var createServers = function(port, lrport) {
  var lr = tiny_lr();
  lr.listen(lrport, function() {
    gutil.log("LiveReload listening on", lrport);
  });
  var app = express();
  app.use(express.static(path.resolve("./dist")));
  app.listen(port, function() {
    gutil.log("HTTP server listening on", port);
  });

  return {
    lr: lr,
    app: app
  };
};

var execWebpack = function(config) {
  webpack(config, function(err, stats) {
    if (err) { throw new gutil.PluginError("execWebpack", err); }
    gutil.log("[execWebpack]", stats.toString({colors: true}));
  });
};

var distPackage = function(file) {
  if (file.basename.indexOf('_package') >= 0) {
    file.basename = 'package';
  }
}