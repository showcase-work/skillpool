"use strict";

module.exports = app => {
    let Department = app.models.department;

    function fetchAllDepartments () {        
        return new Promise((resolve,reject)=>{
            Department.fetchAllDepartments().then(data=>{
                var c = null
                var n = [];;
                var i = -1;

                data.forEach((department)=>{
                    if(c == department.department_name){
                        n[i].skills.push({id:department['Skills.id'], name:department['Skills.name'], position:department['Skills.position'], visible:department['Skills.visible']})
                    }
                    else{
                        i++
                        if(department['Skills.id'] != null){
                            n[i] = {id:department.id,name:department.department_name, position:department.position, visible:department.visible,personalized_name:department.personalized_name,span_class:department.span_class,skills:[]}
                            n[i].skills.push({id:department['Skills.id'], name:department['Skills.name'], position:department['Skills.position'], visible:department['Skills.visible']})
                        }
                    }
                    c = department.department_name;
                })
                return resolve(n);
            })
        })
    }

    return {
        fetchAllDepartments,
    };
};