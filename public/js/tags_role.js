$(document).ready(function(){

    var role = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('role'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '../list_data_files/role.php?query=%QUERY',
            wildcard: '%QUERY'
        }

    });

    role.initialize();

    $('.role').tagsinput({
        maxTags: 1,
        allowDuplicates: false,
      typeaheadjs: {
        valueKey: 'role_name',
        name: 'role',
        displayKey: 'role_name',
        source: role.ttAdapter()
      }
    });

});