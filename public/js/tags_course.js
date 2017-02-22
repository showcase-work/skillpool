$(document).ready(function(){

    var course = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('course'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '../list_data_files/course.php?query=%QUERY',
            wildcard: '%QUERY'
        }

    });

    course.initialize();

    $('#course').tagsinput({
        maxTags: 1,
        allowDuplicates: false,
      typeaheadjs: {
        valueKey: 'course_name',
        name: 'course',
        displayKey: 'course_name',
        source: course.ttAdapter()
      }
    });

});