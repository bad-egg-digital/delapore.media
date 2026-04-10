@php
  $settings = get_field('settings');

  $sectionProps = [
    'class' => implode(' ', $CssClasses->section(get_field('settings'), @$block['name'], @$knockout)),
  ];

  $containerProps = [
    'width' => @$settings['container_width'],
  ];
@endphp

<div id="{{ @$block['anchor'] }}" @if($is_preview) class="{{ $sectionProps['class'] }}" @else {!! get_block_wrapper_attributes($sectionProps) !!} @endif>

  @include('partials.block-acf-intro', ['props' => get_field('intro'), 'settings' => $settings])

  <div class="{{ implode(' ', $CssClasses->container($containerProps)) }}">
    @yield('block-content')
  </div>

  @include('partials.block-acf-footer', ['props' => get_field('footer'), 'settings' => $settings])

</div>
