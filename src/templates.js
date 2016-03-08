var linkTemplate = "\
<span itemscope='' itemtype='http://schema.org/ListItem' itemprop='itemListElement'>\
  <a href='#' aria-selected='true' class='js-selected-navigation-item reponav-item show-builds' itemprop='url' data-hotkey='g b'>\
    <svg aria-hidden='true' class='octicon octicon-primitive-dot icon-for-inactive' height='16' role='img' version='1.1' viewBox='0 0 8 16' width='8'><path d='M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4S0 10.2 0 8z'></path></svg>\
    <span itemprop='name'>Builds</span>\
    <meta itemprop='position' content='2'>\
  </a>\
</span>";

var tabTemplate = "\
{{#hasBuilds}}\
  <div class='subnav subnav-builds'>\
    <a href='{{viewUrl}}' class='btn right'>View All Builds</a>\
    <div class='left subnav-spacer-right'>\
      <h3>Travis CI Builds</h3>\
    </div>\
  </div>\
  <ul class='table-list table-list-bordered table-list-builds'>{{{view}}}</ul>\
{{/hasBuilds}}\
{{^hasBuilds}}\
  {{{view}}}\
{{/hasBuilds}}";

var buildTemplate = "\
{{#builds.length}}\
  {{#builds}}\
    <li id='build_{{id}}' class='table-list-item build'>\
      <div class='table-list-cell table-list-cell-type'>\
        <span class='{{css_class}}'>\
          {{#finished}}\
            {{#success}}\
              <svg aria-hidden='true' class='octicon octicon-check' height='16' role='img' version='1.1' viewBox='0 0 12 16' width='12'><path d='M12 5L4 13 0 9l1.5-1.5 2.5 2.5 6.5-6.5 1.5 1.5z'></path></svg>\
            {{/success}}\
            {{^success}}\
              <svg aria-hidden='true' class='octicon octicon-x' height='16' role='img' version='1.1' viewBox='0 0 12 16' width='12'><path d='M7.48 8l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75-1.48-1.48 3.75-3.75L0.77 4.25l1.48-1.48 3.75 3.75 3.75-3.75 1.48 1.48-3.75 3.75z'></path></svg>\
            {{/success}}\
          {{/finished}}\
          {{^finished}}\
            <svg aria-hidden='true' class='octicon octicon-primitive-dot icon-for-inactive' height='16' role='img' version='1.1' viewBox='0 0 8 16' width='8'><path d='M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4S0 10.2 0 8z'></path></svg>\
          {{/finished}}\
        </span>\
      </div>\
      <div class='table-list-cell issue-title'>\
        <a href='{{build_url}}' class='issue-title-link' target='_blank'>{{message}}</a>\
        <div class='issue-meta'>\
          <span class='issue-meta-section'>\
            #{{number}} on {{branch}}\
            {{#finished}}- {{#finished_at_string}}finished {{finished_at_string}}, took {{duration}}{{/finished_at_string}}{{/finished}}\
            {{^finished}}- state: {{state}}{{#started_at_string}}, started {{started_at_string}}{{/started_at_string}}{{/finished}}\
          </span>\
        </div>\
      </div>\
    </li>\
  {{/builds}}\
{{/builds.length}}\
{{^builds.length}}\
  <div class='blankslate spacious large-format'>\
    <svg aria-hidden='true' class='octicon octicon-issue-opened' height='40' role='img' version='1.1' viewBox='0 0 14 16' width='35'><path d='M7 2.3c3.14 0 5.7 2.56 5.7 5.7S10.14 13.7 7 13.7 1.3 11.14 1.3 8s2.56-5.7 5.7-5.7m0-1.3C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7S10.86 1 7 1z m1 3H6v5h2V4z m0 6H6v2h2V10z'></path></svg>\
    <h3>Travis CI</h3>\
    <p>No builds found yet. Visit <a href='{{viewUrl}}'>travis-ci.org</a> for more details.</a></p>\
  </div>\
{{/builds.length}}";
