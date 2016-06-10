// Determine the repository namespace
var repoPath = window.location.pathname.split("/").slice(1, 3).join("/");

// Travis CI api token for private builds
var travisApiToken;

function getApiToken(cb) {
  chrome.storage.sync.get("travisApiToken", function(items) {
    travisApiToken = items.travisApiToken;
    cb();
  });

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace !== "sync") return;

    for (var key in changes) {
      if (key !== "travisApiToken") continue;
      travisApiToken = changes[key].newValue;
    }
  });
}

function formatBuildItem(webBaseUrl, repoPath, item, commit) {
  // Generate build url
  item.build_url = webBaseUrl + repoPath + "/builds/" + item.id;

  // Do not include multi-line messages in the list
  item.message = commit.message.split("\n")[0];

  // Determine outcome of the build
  item.success = item.state === "passed";

  // Set css class for the icons
  item.css_class = "text-pending";

  // Set extra attributes when build is finished
  if (item.finished_at) {
    item.finished = true;
    item.duration = moment.utc(moment(item.finished_at).diff(moment(item.started_at))).format("m [minutes and] s [seconds]");
    item.finished_at_string = moment(item.finished_at).fromNow();
    item.css_class = item.success ? "text-success" : "text-failure";
  }
  else {
    if (item.started_at) {
      item.started_at_string = moment(item.started_at).fromNow();
    }
  }

  item.branch = commit.branch;

  return item;
}

function apiBaseUrl(isPrivate) {
  return isPrivate ? "https://api.travis-ci.com/repos/" : "https://api.travis-ci.org/repos/";
}

function hasBuilds(isPrivate, cb) {
  var key = "travis/" + repoPath;
  var exists = localStorage.getItem(key);

  // Do not make any extra API calls if we already made a call
  if (exists !== null) {
    return cb(exists == "1");
  }

  $.ajax({
    url: apiBaseUrl(isPrivate) + repoPath + ".json",
    headers: isPrivate ? { "Authorization": "token " + travisApiToken } : undefined,
    success: function() {
      localStorage.setItem(key, "1");
      cb(true);
    },
    error: function(resp) {
      if (resp.status == 404) localStorage.setItem(key, "0");
      cb(false);
    }
  });
}

function injectBuildsLink(isPrivate) {
  // Do not inject if not on repository page
  if ($(".repository-content").length == 0) return;

  // Do not inject if nav bar is not there for some reason
  if ($(".reponav").length == 0) return;

  // Do not reinject the link if it's still on the page
  if ($(".show-builds").length > 0) return;

  // Do not inject if private but no API token is configured
  if (isPrivate && !travisApiToken) return;

  hasBuilds(isPrivate, function(result) {
    // No not inject link if project does not have builds
    if (!result) return;

    var linkHtml = Mustache.render(linkTemplate);
    var navLinks = $(".reponav span[itemprop='itemListElement']");

    // Add "builds" link after the "code" tab link
    $(linkHtml).insertAfter(navLinks[0]);
  });
}

function inject() {
  var isPrivate = $("h1.private").length > 0;
  var webBaseUrl = isPrivate ? "https://travis-ci.com/" : "https://travis-ci.org/";

  // Automatically inject the builds link
  injectBuildsLink(isPrivate);

  // Reinject the builds tab link when user switched between repository tabs
  $(document).on("pjax:complete", function() { injectBuildsLink(isPrivate) });

  $("body").on("click", ".show-builds", function(e) {
    e.preventDefault();

    // Show progress loader
    $(".page-context-loader").show();

    // Unselect any active nav links
    $(".reponav a.reponav-item").removeClass("selected");

    // Make our own tab link active
    $(this).addClass("selected");
    
    var viewUrl = webBaseUrl + repoPath;
    var travisUrl = apiBaseUrl(isPrivate) + repoPath + "/builds";
    var builds = [];

    // Fetch builds data from Travis API
    // Pull requests are skipped since there's already PR tab
    $.ajax({
      url: travisUrl,
      data: { event_type: "push" },
      dataType: "json",
      accepts: {
        "json": "application/vnd.travis-ci.2+json"
      },
      headers: isPrivate ? { "Authorization": "token " + travisApiToken } : undefined,
      success: function(resp) {
        // Done loading
        $(".page-context-loader").hide();

        // Refarmat builds for the view
        for (i in resp.builds) {
          builds.push(formatBuildItem(webBaseUrl, repoPath, resp.builds[i], resp.commits[i]))
        }

        // Render builds list
        var view = Mustache.render(buildTemplate, {
          viewUrl: viewUrl,
          builds: builds
        });

        // Render builds tab content
        var output = Mustache.render(tabTemplate, {
          hasBuilds: builds.length > 0,
          view: view,
          viewUrl: viewUrl
        });

        $(".repository-content").html(output);
      }
    });
  });
}

$(function() {
  getApiToken(inject);
});
