$(document).ready(function(){

    var skills = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('skills'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '../list_data_files/skills.php?query=%QUERY',
            wildcard: '%QUERY'
        }

    });

    skills.initialize();

    $('.skills').tagsinput({
        allowDuplicates: false,
      typeaheadjs: {
        valueKey: 'skills_name',
        name: 'skills',
        displayKey: 'skills_name',
        source: skills.ttAdapter()
      }
    });

});