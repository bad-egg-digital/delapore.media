@extends('layouts.block-acf', [
  'block' => $block,
  'is_preview' => $is_preview,
  'context' => $context,
])

@section('block-content')
  {!! the_field('content') !!}
@overwrite
