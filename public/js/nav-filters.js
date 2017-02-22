(function($) {
        $.fn.applydepartmentfilter = function(){
          $(this).multiselect({
            onInitialized: function(select, container) {
                                alert('Initialized.');
            },
            maxHeight: 300,
            enableClickableOptGroups: true,
            buttonText: function(options, select) {
                            if (options.length === 0) {
                                return 'Departments';
                            }
                             else {
                                 var labels = [];
                                 options.each(function() {
                                     if ($(this).attr('label') !== undefined) {
                                         labels.push($(this).attr('label'));
                                     }
                                     else {
                                         labels.push($(this).html());
                                     }
                                 });
                                 return labels.join(', ') + '';
                             }
                        },
             onChange: function(event) {
                console.log("working here");
                fetchFilteredData();
                //check();
                            },
              checkboxName: 'dept_filters[]',
             // includeSelectAllOption: true,
             // selectAllText: 'Check all!',
              buttonClass: 'multiple-select-custom',
              allSelectedText: 'Departments'
          });
        }


        $.fn.applygenresfilter = function(){
              /*initializing dropdown filters for genres*/
              $(this).multiselect({
                maxHeight: 300,
                enableClickableOptGroups: true,
                buttonClass: 'multiple-select-custom',
                buttonText: function(options, select) {

                                if (options.length === 0) {
                                    return 'Genres';
                                }
                                 else {
                                     var labels = [];
                                     options.each(function() {
                                         if ($(this).attr('label') !== undefined) {
                                             labels.push($(this).attr('label'));
                                         }
                                         else {
                                             labels.push($(this).html());
                                         }
                                     });
                                     return labels.join(', ') + '';
                                 }
                            },
                 onChange: function(event) {
                    fetchFilteredData();
                                },
                  checkboxName: 'genre_filters[]',
                  enableCaseInsensitiveFiltering: true
          }); 
        }

        $.fn.applyskillsfilter = function(){

              $(this).multiselect({
                maxHeight: 300,
                enableClickableOptGroups: true,
                buttonClass: 'multiple-select-custom',
                buttonText: function(options, select) {
                                if (options.length === 0) {
                                    return 'Skills';
                                }
                                 else {
                                     var labels = [];
                                     options.each(function() {
                                         if ($(this).attr('label') !== undefined) {
                                             labels.push($(this).attr('label'));
                                         }
                                         else {
                                             labels.push($(this).html());
                                         }
                                     });
                                     return labels.join(', ') + '';
                                 }
                            },
                 onChange: function(event) {
                    fetchFilteredData();
                                },
                  checkboxName: 'skills_filters[]',
                  enableCaseInsensitiveFiltering: true
          });
        }


        $.fn.applytypefilter = function(){
              $(this).multiselect({
                maxHeight: 300,
                enableClickableOptGroups: true,
                buttonClass: 'multiple-select-custom',
                buttonText: function(options, select) {
                                if (options.length === 0) {
                                    return 'Type';
                                }
                                 else {
                                     var labels = [];
                                     options.each(function() {
                                         if ($(this).attr('label') !== undefined) {
                                             labels.push($(this).attr('label'));
                                         }
                                         else {
                                             labels.push($(this).html());
                                         }
                                     });
                                     return labels.join(', ') + '';
                                 }
                            },
                onChange: function(event) {
                    fetchFilteredData();
                                },
                checkboxName: 'type_filters[]',

          });
        }
}(jQuery));