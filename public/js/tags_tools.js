$(document).ready(function(){

    var tools = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('tools'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '../list_data_files/tools.php?query=%QUERY',
            wildcard: '%QUERY'
        }

    });

    tools.initialize();

    $('.tools').tagsinput({
        allowDuplicates: false,
        typeaheadjs: {
            valueKey: 'tool_name',
            name: 'tools',
            displayKey: 'tool_name',
            source: tools.ttAdapter()
        }
    });

});