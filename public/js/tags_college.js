$(document).ready(function(){

    var college = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('college'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '../list_data_files/college.php?query=%QUERY',
            wildcard: '%QUERY'
        }

    });

    college.initialize();

    $('#college').tagsinput({
        maxTags: 1,
        allowDuplicates: false,
      typeaheadjs: {
        valueKey: 'college_name',
        name: 'college',
        displayKey: 'college_name',
        source: college.ttAdapter()

      }
    });
    
});