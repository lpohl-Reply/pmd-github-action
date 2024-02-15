const core = require('@actions/core');

function generate_description(lines, rule) {
    let description = '';

    if (core.getInput('displayAnnotationDescription', { required: false }) === 'true') {
        description = lines.join('\n') + '\n\n'
    }
    // const link = `<a href="${rule.helpUri.trim()}" type="text/html">${rule.id}</a>`
    const link = `https://github.com/lpohl-Reply/pmd-github-action/wiki/${rule.id}`;
    const desc =`${description}${link}\n(Priority: ${rule.properties.priority}, Ruleset: ${rule.properties.ruleset})`;
    return desc;
}

function calculate_violations(report) {
    let count = 0;
    let priorityFilter = parseInt(core.getInput('countViolationsPriorityFilter', { required: false }))
    
    if (report !== null) {
        if (!priorityFilter || priorityFilter.isNaN) {
            count = report.runs[0].results.length;
        }else{
            count = report.runs[0].results.filter(function(item){
                return report.runs[0].tool.driver.rules[item.ruleIndex].properties.priority <= priorityFilter;
            }).length;
        }
    }

    return count;
}


module.exports.generate_description = generate_description;
module.exports.calculate_violations = calculate_violations;
