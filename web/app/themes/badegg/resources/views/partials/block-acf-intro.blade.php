@if(@$props['heading'] || @$props['blurb'])
  @php
    $containerProps = [
      'width' => $props['container_width'],
      'location' => 'block-intro',
      'section' => true,
      'align' => $props['align'],
      'wysiwyg' => true,
    ];
  @endphp

  <div class="{{ implode(' ', $CssClasses->container($containerProps, @$settings)) }}">
    @if($props['heading']) <h2>{{ $props['heading'] }}</h3> @endif
    @if($props['blurb']) <p>{{ $props['blurb'] }}</p> @endif
  </div>

@endif
