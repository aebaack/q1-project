$(document).ready(function (){
  $(".button-collapse").sideNav();
  $("select").material_select();
  $(".search").leanModal();
  $(".poems").leanModal({
    dismissible: false
  });
});
