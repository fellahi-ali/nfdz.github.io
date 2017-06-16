jQuery(document).ready(function($) {
  $('.projects-grid').isotope({
    // options
    itemSelector: '.project-grid-item',
    layoutMode: 'fitRows'
  });
});

function filterProjects(){
    $('.projects-grid').isotope({ filter: '.android' })
}
