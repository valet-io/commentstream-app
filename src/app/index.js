'use strict';

require('angular').module('CommentStream', [
  require('../event')
])
.config(useHtml5Mode);

function useHtml5Mode ($locationProvider) {
  $locationProvider.html5Mode(true);
}

useHtml5Mode.$inject = ['$locationProvider'];

module.exports = 'CommentStream';
