@if($socials)
  <ul class="socials nolist">
    @foreach($socials as $social)
      <li>
        <a href="{{ $social['link'] }}" rel="noopener nofollow noreferrer me" target="_blank">
          <i>{!! $social['svg'] !!}</i>
          <span class="visually-hidden">{{ $social['icon'] }}</span>
        </a>
      </li>
    @endforeach
  </ul>
@endif
