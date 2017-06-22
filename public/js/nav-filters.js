(function($) {

        $.fn.applydepartmentfilter = function(){
        var self = $(this);
          self.multiselect({
            onInitialized: function(select, container) {
                                $(".menu-dashboard").show();
                                //alert('Initialized.');
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
                fetchdata(1);
                //check();
                            },
              checkboxName: 'dept_filters[]',
             // includeSelectAllOption: true,
             // selectAllText: 'Check all!',
              buttonClass: 'multiple-select-custom',
              allSelectedText: 'Departments'
          });

          var options = [];

          $.ajax({
            url:"/api/lists/departments",
            method:"GET",
            success:function(data){
                data.forEach(function(department){
                    options.push({label: department.department_name, title: department.department_name, value: department.id});
                })
                self.multiselect("dataprovider",options) 
            },
            error:function(err){
                console.log(err);
            }
          })


        }


        $.fn.applygenresfilter = function(){
              /*initializing dropdown filters for genres*/
            var self = $(this);
            self.multiselect({
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
                    fetchdata(1);
                                },
                  checkboxName: 'genre_filters[]',
                  enableCaseInsensitiveFiltering: true
          });
              

          var options = [];

          $.ajax({
            url:"/api/lists/tags",
            method:"GET",
            success:function(data){
                data.forEach(function(genre){
                    options.push({label: genre.text, title: genre.text, value: genre.value});
                })
                self.multiselect("dataprovider",options) 
            },
            error:function(err){
                console.log(err);
            }
          })

        }

        $.fn.applyskillsfilter = function(){

            var self = $(this);
            self.multiselect({
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
                    fetchdata(1);
                                },
                  checkboxName: 'skills_filters[]',
                  enableCaseInsensitiveFiltering: true
          });

          var options = [];

          $.ajax({
            url:"/api/lists/skills",
            method:"GET",
            success:function(data){
                data.forEach(function(skill){
                    options.push({label: skill.name, title: skill.name, value: skill.id});
                })
                self.multiselect("dataprovider",options) 
            },
            error:function(err){
                console.log(err);
            }
          })

        }


        $.fn.applytypefilter = function(){
            var self = $(this)
            self.multiselect({
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
                    fetchdata(1);
                                },
                checkboxName: 'type_filters[]',

            });

            var options = [];

            $.ajax({
              url:"/api/lists/data-types",
              method:"GET",
              success:function(data){
                  data.forEach(function(datatype){
                      options.push({label: datatype.text, title: datatype.text, value: datatype.value});
                  })
                  self.multiselect("dataprovider",options) 
              },
              error:function(err){
                  console.log(err);
              }
            })

    }
}(jQuery));