$(document).ready(function(){

    var genre = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('genre'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/api/autocomplete/genres?query=%QUERY',
            wildcard: '%QUERY'
        }

    });

    genre.initialize();

    $('.genre').tagsinput({
        allowDuplicates: false,
      typeaheadjs: {
        valueKey: 'genre_name',
        name: 'genre',
        displayKey: 'genre_name',
        source: genre.ttAdapter()
      }
    });

});