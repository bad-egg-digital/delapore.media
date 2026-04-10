@if($props['blurb'] || $props['links'])
  @php
    $containerProps = [
      'width' => $props['container_width'],
      'location' => 'block-footer',
      'section' => true,
      'align' => $props['align'],
      'wysiwyg' => true,
    ];
  @endphp

  <div class="{{ implode(' ', $CssClasses->container($containerProps, @$settings)) }}">
    @if($props['blurb']) <p>{{ $props['blurb'] }}</p> @endif

    @if(@$props['links'])
      <div class="section-footer inner-top">
        <div class="container">
          <div class="btn-wrap">
            @foreach($props['links'] as $link)
              @include('components.button', $link)
            @endforeach
          </div>
        </div>
      </div>
    @endif
  </div>

@endif


