<?php
  // Load everything needed
  require __DIR__ . '/../vendor/autoload.php';

  // Start a session here
  session_start();

  // Set default timezone for entries
  date_default_timezone_set("Europe/Stockholm");

  // Get settings and instantiate the app
  $settings = require __DIR__ . '/../src/settings.php';
  $app = new \Slim\App($settings);

  // Register our dependencies through our container
  $dependencies = require __DIR__ . '/../src/container.php';
  $dependencies($app);

  // Register routes
  $login = require __DIR__ . '/../src/routes/login.php';
  $login($app);

  $view = require __DIR__ . '/../src/routes/view.php';
  $view($app);

  $user = require __DIR__ . '/../src/routes/user.php';
  $user($app);

  $entry = require __DIR__ . '/../src/routes/entry.php';
  $entry($app);

  $comment = require __DIR__ . '/../src/routes/comment.php';
  $comment($app);

  // Run app
  $app->run();
