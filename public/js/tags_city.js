$(document).ready(function(){
    var location = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('city'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '../list_data_files/city.php?query=%QUERY',
            wildcard: '%QUERY'
        }

    });

    location.initialize();

    $('#city').tagsinput({
        maxTags: 1,
        freeInput: true,
        allowDuplicates: false,
      typeaheadjs: {
        valueKey: 'city',
        name: 'location',
        displayKey: 'city',
        source: location.ttAdapter()

      }
    });
})

