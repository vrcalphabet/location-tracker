<?php
require_once '../../app/bootstrap.php';

use App\Utils\Authenticator;
use App\Utils\Response;
use App\Utils\Validator;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  Response::code(405);
}

$rules = [
  'token' => 'required|string|min:32|max:1024',
];

$errors = Validator::validate($_GET, $rules);
if ($errors !== true) {
  Response::code(403);
}

if (!Authenticator::verify_get($_GET['token'])) {
  Response::code(403);
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Location Tracker</title>
  <link rel="stylesheet" href="/assets/view.css">
  <script>
    var env = {
      GOOGLE_API_KEY: "<?= $_ENV['GOOGLE_API_KEY'] ?>",
    };
    document.currentScript.remove();
  </script>
  <script src="/assets/view.js" defer></script>
</head>
<body>
  <div class="js-maps"></div>
  <div class="location-card js-location-card --pointer-none">
    <div class="location-card__backdrop --backdrop"></div>
    <div class="locate">
      <div class="locate__button js-locate__button --pointer-all">
        <svg-loader name="compass" size="22" />
      </div>
    </div>
    <div class="location-card__body --pointer-all js-location-card__body">
      <div class="grabber js-grabber">
        <div class="grabber__body"></div>
      </div>
      <div class="location-card__location-info js-location-card__location-info">
        <div class="location-card__label">
          <svg-loader name="map-pin" size="16" />現在地
        </div>
        <div class="location-card__address">
          <span class="js-location-card__address">読み込み中...</span>
          <div class="location-card__reload js-location-card__reload">
            <svg-loader name="rotate-cw" size="18" />
          </div>
        </div>
        <div class="location-card__uncertainty">
          <span class="js-location-card__uncertainty">誤差 --- m</span>
          &nbsp;・&nbsp;
          <span class="js-location-card__last-synced">------</span>
        </div>
      </div>
      <div class="location-card__status-group">
        <div class="status-badge status-badge--red js-status-badge__silent-mode" hidden>
          <span class="status-badge__text">
            <div class="status-badge__icon">
              <svg-loader name="bell-off" size="20" />
            </div>
            <span>
              <b>マナーモード設定中</b><br />
              通知に気付かない可能性があります。
            </span>
          </span>
        </div>
        <div class="status-badge status-badge--green js-status-badge__battery-saver-mode" hidden>
          <span class="status-badge__text">
            <div class="status-badge__icon">
              <svg-loader name="battery-charging" size="20" />
            </div>
            <span>
              <b>省電力モード設定中</b><br />
              通知が遅れたり、位置情報の精度が落ちている可能性があります。
            </span>
          </span>
        </div>
      </div>
      <div class="location-card__divider"></div>
      <div class="location-card--bg-slate update-time">
        <div class="update-time__item">
          <span class="update-time__label">
            <svg-loader name="smartphone" size="14" />最終同期:
          </span>
          <span class="update-time__value js-update-time__last-synced">----</span>
        </div>
        <div class="update-time__divider"></div>
        <div class="update-time__item">
          <span class="update-time__label">
            <svg-loader name="clock" size="14" />最終確認:
          </span>
          <span class="update-time__value js-update-time__last-checked">----</span>
        </div>
      </div>
    </div>
  </div>
  <div class="header js-header --pointer-none">
    <div class="ad js-ad">
      <div class="ad__label">[PR]</div>
      <div class="ad__content js-ad__content"></div>
    </div>
    <div class="header__backdrop --backdrop"></div>
    <div class="header__body">
      <div class="header__time js-header__time">--:--</div>
      <div class="header__battery-info js-header__battery-info">
        <svg-loader name="battery-medium" size="24" class="js-header__battery-icon" />
        <div class="header__battery js-header__battery">--%</div>
      </div>
    </div>
  </div>
</body>
</html>
