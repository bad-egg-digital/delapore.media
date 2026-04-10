@php($image = wp_get_attachment_image_src(@$id, @$size))

@if($image)
  <img
    @if(@$lazy && !is_admin())
      src="{{ wp_get_attachment_image_src($id, 'lazy')[0] }}"
      data-src="{{ @$image[0] }}"
      class="lazy {{ @$class }}"
    @else
      src="{{ $image[0] }}"
      class="{{ @$class }}"
    @endif

    alt="{{ get_post_meta( $id, '_wp_attachment_image_alt', true ) }}"
    width="{{ $image[1] }}"
    height="{{ $image[2] }}"
  />
@endif
