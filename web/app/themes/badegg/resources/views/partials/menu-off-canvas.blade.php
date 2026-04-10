<div class="menu-off-canvas bg-white">
  <div class="inner">
    <div class="menu-off-canvas-logo">
      <a class="brand" href="{{ home_url('/') }}">
        Site Logo
      </a>

      <button
        class="block menu-toggle menu-close js-menu-close"
        type="button"
        command="toggle-popover"
        commandfor="menu-side"
        aria-expanded="false"
        aria-controls="menu-side"
      >
        <i></i>
        <i></i>
        <i></i>
        <span class="visually-hidden">Close Mobile Menu</span>
      </button>
    </div>

    @if (has_nav_menu('primary_navigation'))
      {!! wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'caret-links nolist']) !!}
    @endif
  </div>

</div>
