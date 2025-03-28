/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.984375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "061. Add - /web/index.php/api/v2/recruitment/vacancies"], "isController": false}, {"data": [1.0, 500, 1500, "015. Home - /web/dist/fonts/nunito-sans-v6-latin-ext_latin-800.woff2"], "isController": false}, {"data": [1.0, 500, 1500, "016. Home - /web/dist/fonts/nunito-sans-v6-latin-ext_latin-regular.woff2"], "isController": false}, {"data": [1.0, 500, 1500, "080. Save - /web/index.php/api/v2/recruitment/candidates/103/history"], "isController": false}, {"data": [1.0, 500, 1500, "076. Save - /web/index.php/api/v2/recruitment/candidates/103"], "isController": false}, {"data": [1.0, 500, 1500, "076. Save - /web/index.php/api/v2/recruitment/candidates/102"], "isController": false}, {"data": [1.0, 500, 1500, "076. Save - /web/index.php/api/v2/recruitment/candidates/101"], "isController": false}, {"data": [1.0, 500, 1500, "026. Login - /web/dist/fonts/nunito-sans-v6-latin-ext_latin-italic.woff2"], "isController": false}, {"data": [1.0, 500, 1500, "079. Save - /web/index.php/api/v2/leave/workweek"], "isController": false}, {"data": [1.0, 500, 1500, "080. Save - /web/index.php/api/v2/recruitment/candidates/101/history"], "isController": false}, {"data": [0.5, 500, 1500, "004. Home - /"], "isController": false}, {"data": [1.0, 500, 1500, "073. Save - /web/index.php/recruitment/addCandidate/101"], "isController": false}, {"data": [1.0, 500, 1500, "078. Save - /web/index.php/api/v2/recruitment/vacancies"], "isController": false}, {"data": [1.0, 500, 1500, "073. Save - /web/index.php/recruitment/addCandidate/102"], "isController": false}, {"data": [1.0, 500, 1500, "073. Save - /web/index.php/recruitment/addCandidate/103"], "isController": false}, {"data": [1.0, 500, 1500, "041. Recruitment - /web/index.php/recruitment/viewRecruitmentModule-0"], "isController": false}, {"data": [1.0, 500, 1500, "077. Save - /web/index.php/api/v2/recruitment/candidates/103/actions/allowed"], "isController": false}, {"data": [1.0, 500, 1500, "041. Recruitment - /web/index.php/recruitment/viewRecruitmentModule-1"], "isController": false}, {"data": [1.0, 500, 1500, "004. Home - /-1"], "isController": false}, {"data": [1.0, 500, 1500, "041. Recruitment - /web/index.php/recruitment/viewRecruitmentModule-2"], "isController": false}, {"data": [1.0, 500, 1500, "004. Home - /-0"], "isController": false}, {"data": [1.0, 500, 1500, "033. Login - /web/index.php/api/v2/dashboard/employees/subunit"], "isController": false}, {"data": [1.0, 500, 1500, "041. Recruitment - /web/index.php/recruitment/viewRecruitmentModule"], "isController": false}, {"data": [1.0, 500, 1500, "029. Login - /web/index.php/api/v2/dashboard/employees/action-summary"], "isController": false}, {"data": [1.0, 500, 1500, "024. Login - /web/dist/fonts/nunito-sans-v6-latin-ext_latin-700.woff2"], "isController": false}, {"data": [0.5, 500, 1500, "082. Logout - /web/index.php/auth/logout"], "isController": false}, {"data": [1.0, 500, 1500, "037. Login - /web/index.php/pim/viewPhoto/empNumber/22"], "isController": false}, {"data": [1.0, 500, 1500, "084. Logout - /web/index.php/core/i18n/messages"], "isController": false}, {"data": [1.0, 500, 1500, "017. Home - /web/dist/fonts/bootstrap-icons.woff2"], "isController": false}, {"data": [1.0, 500, 1500, "039. Login - /web/index.php/buzz/photo/9"], "isController": false}, {"data": [1.0, 500, 1500, "014. Home - /web/dist/img/blob.svg"], "isController": false}, {"data": [1.0, 500, 1500, "048. Recruitment - /web/index.php/api/v2/recruitment/candidates/statuses"], "isController": false}, {"data": [1.0, 500, 1500, "059. Add - /web/index.php/pim/viewPhoto/empNumber/7"], "isController": false}, {"data": [1.0, 500, 1500, "040. Login - /web/index.php/pim/viewPhoto/empNumber/9"], "isController": false}, {"data": [1.0, 500, 1500, "030. Login - /web/index.php/api/v2/dashboard/shortcuts"], "isController": false}, {"data": [1.0, 500, 1500, "075. Save - /web/index.php/pim/viewPhoto/empNumber/7"], "isController": false}, {"data": [1.0, 500, 1500, "062. Add - /web/index.php/api/v2/leave/holidays"], "isController": false}, {"data": [1.0, 500, 1500, "019. Login - /web/index.php/auth/validate-1"], "isController": false}, {"data": [1.0, 500, 1500, "031. Login - /web/index.php/api/v2/buzz/feed"], "isController": false}, {"data": [1.0, 500, 1500, "056. Recruitment - /web/index.php/api/v2/leave/holidays"], "isController": false}, {"data": [1.0, 500, 1500, "027. Login - /web/index.php/pim/viewPhoto/empNumber/7"], "isController": false}, {"data": [1.0, 500, 1500, "044. Recruitment - /web/index.php/pim/viewPhoto/empNumber/7"], "isController": false}, {"data": [1.0, 500, 1500, "019. Login - /web/index.php/auth/validate-0"], "isController": false}, {"data": [0.5, 500, 1500, "019. Login - /web/index.php/auth/validate"], "isController": false}, {"data": [1.0, 500, 1500, "057. Add - /web/index.php/recruitment/addCandidate"], "isController": false}, {"data": [1.0, 500, 1500, "028. Login - /web/index.php/api/v2/dashboard/employees/time-at-work"], "isController": false}, {"data": [1.0, 500, 1500, "077. Save - /web/index.php/api/v2/recruitment/candidates/101/actions/allowed"], "isController": false}, {"data": [1.0, 500, 1500, "023. Login - /web/dist/fonts/nunito-sans-v6-latin-ext_latin-300.woff2"], "isController": false}, {"data": [1.0, 500, 1500, "055. Recruitment - /web/index.php/api/v2/leave/workweek"], "isController": false}, {"data": [1.0, 500, 1500, "035. Login - /web/index.php/events/push"], "isController": false}, {"data": [1.0, 500, 1500, "058. Add - /web/index.php/core/i18n/messages"], "isController": false}, {"data": [1.0, 500, 1500, "038. Login - /web/index.php/pim/viewPhoto/empNumber/11"], "isController": false}, {"data": [1.0, 500, 1500, "054. Recruitment - /web/index.php/api/v2/leave/holidays"], "isController": false}, {"data": [1.0, 500, 1500, "053. Recruitment - /web/index.php/api/v2/leave/workweek"], "isController": false}, {"data": [1.0, 500, 1500, "072. Save - /web/index.php/api/v2/recruitment/candidates"], "isController": false}, {"data": [1.0, 500, 1500, "034. Login - /web/index.php/api/v2/dashboard/employees/locations"], "isController": false}, {"data": [1.0, 500, 1500, "080. Save - /web/index.php/api/v2/recruitment/candidates/102/history"], "isController": false}, {"data": [1.0, 500, 1500, "081. Save - /web/index.php/api/v2/leave/holidays"], "isController": false}, {"data": [1.0, 500, 1500, "018. Home - /web/dist/fonts/nunito-sans-v6-latin-ext_latin-600.woff2"], "isController": false}, {"data": [1.0, 500, 1500, "074. Save - /web/index.php/core/i18n/messages"], "isController": false}, {"data": [1.0, 500, 1500, "060. Add - /web/index.php/api/v2/leave/workweek"], "isController": false}, {"data": [1.0, 500, 1500, "047. Recruitment - /web/index.php/api/v2/recruitment/vacancies"], "isController": false}, {"data": [1.0, 500, 1500, "049. Recruitment - /web/index.php/api/v2/recruitment/hiring-managers"], "isController": false}, {"data": [1.0, 500, 1500, "021. Login - /web/index.php/core/i18n/messages"], "isController": false}, {"data": [1.0, 500, 1500, "005. Home - /web/index.php/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "010. Home - /web/index.php/core/i18n/messages"], "isController": false}, {"data": [1.0, 500, 1500, "046. Recruitment - /web/index.php/api/v2/admin/job-titles"], "isController": false}, {"data": [1.0, 500, 1500, "043. Recruitment - /web/index.php/core/i18n/messages"], "isController": false}, {"data": [1.0, 500, 1500, "077. Save - /web/index.php/api/v2/recruitment/candidates/102/actions/allowed"], "isController": false}, {"data": [1.0, 500, 1500, "082. Logout - /web/index.php/auth/logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "082. Logout - /web/index.php/auth/logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "045. Recruitment - /web/index.php/api/v2/recruitment/candidates"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 96, 0, 0.0, 207.2083333333334, 1, 713, 183.0, 303.39999999999975, 473.84999999999985, 713.0, 5.404188245890565, 100.69302733055619, 3.552050935177888], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["061. Add - /web/index.php/api/v2/recruitment/vacancies", 3, 0, 0.0, 193.66666666666666, 179, 222, 180.0, 222.0, 222.0, 222.0, 0.48685491723466406, 0.9247390761927946, 0.3375654211295034], "isController": false}, {"data": ["015. Home - /web/dist/fonts/nunito-sans-v6-latin-ext_latin-800.woff2", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 270.8067602040816, 6.248007015306122], "isController": false}, {"data": ["016. Home - /web/dist/fonts/nunito-sans-v6-latin-ext_latin-regular.woff2", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 251.32665094339623, 5.813310731132075], "isController": false}, {"data": ["080. Save - /web/index.php/api/v2/recruitment/candidates/103/history", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 10.136405414438503, 3.5772476604278074], "isController": false}, {"data": ["076. Save - /web/index.php/api/v2/recruitment/candidates/103", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 9.363810221354166, 3.0364990234375], "isController": false}, {"data": ["076. Save - /web/index.php/api/v2/recruitment/candidates/102", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 9.98806423611111, 3.238932291666667], "isController": false}, {"data": ["076. Save - /web/index.php/api/v2/recruitment/candidates/101", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 9.878305288461538, 3.203339629120879], "isController": false}, {"data": ["026. Login - /web/dist/fonts/nunito-sans-v6-latin-ext_latin-italic.woff2", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 254.95515046296296, 5.696614583333333], "isController": false}, {"data": ["079. Save - /web/index.php/api/v2/leave/workweek", 3, 0, 0.0, 178.33333333333334, 174, 182, 179.0, 182.0, 182.0, 182.0, 0.4878048780487805, 0.6802591463414633, 0.2853467987804878], "isController": false}, {"data": ["080. Save - /web/index.php/api/v2/recruitment/candidates/101/history", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 10.029141865079366, 3.539393187830688], "isController": false}, {"data": ["004. Home - /", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 6.79377158894646, 1.7541018998272886], "isController": false}, {"data": ["073. Save - /web/index.php/recruitment/addCandidate/101", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 14.819683056872039, 3.2120112559241707], "isController": false}, {"data": ["078. Save - /web/index.php/api/v2/recruitment/vacancies", 3, 0, 0.0, 186.0, 182, 193, 183.0, 193.0, 193.0, 193.0, 0.4877255730775484, 0.9263928121443668, 0.3395979820354414], "isController": false}, {"data": ["073. Save - /web/index.php/recruitment/addCandidate/102", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 14.819683056872039, 3.2120112559241707], "isController": false}, {"data": ["073. Save - /web/index.php/recruitment/addCandidate/103", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 15.403709975369457, 3.3385929802955663], "isController": false}, {"data": ["041. Recruitment - /web/index.php/recruitment/viewRecruitmentModule-0", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 10.464638157894736, 3.5464638157894735], "isController": false}, {"data": ["077. Save - /web/index.php/api/v2/recruitment/candidates/103/actions/allowed", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 6.9946890394088665, 2.948930110837438], "isController": false}, {"data": ["041. Recruitment - /web/index.php/recruitment/viewRecruitmentModule-1", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 15.324139835858585, 3.3686474116161613], "isController": false}, {"data": ["004. Home - /-1", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 14.13112331081081, 2.808277027027027], "isController": false}, {"data": ["041. Recruitment - /web/index.php/recruitment/viewRecruitmentModule-2", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 1741.2109375, 0.0], "isController": false}, {"data": ["004. Home - /-0", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 3.3485683692893398, 1.259121192893401], "isController": false}, {"data": ["033. Login - /web/index.php/api/v2/dashboard/employees/subunit", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 8.131574876237623, 3.1327351485148514], "isController": false}, {"data": ["041. Recruitment - /web/index.php/recruitment/viewRecruitmentModule", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 17.387331298200515, 3.446838849614396], "isController": false}, {"data": ["029. Login - /web/index.php/api/v2/dashboard/employees/action-summary", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 8.335092905405405, 3.4575591216216215], "isController": false}, {"data": ["024. Login - /web/dist/fonts/nunito-sans-v6-latin-ext_latin-700.woff2", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 276.1080994897959, 6.248007015306122], "isController": false}, {"data": ["082. Logout - /web/index.php/auth/logout", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 8.192176198010849, 2.3186737115732368], "isController": false}, {"data": ["037. Login - /web/index.php/pim/viewPhoto/empNumber/22", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 192.7812948994253, 3.5638918821839085], "isController": false}, {"data": ["084. Logout - /web/index.php/core/i18n/messages", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 224.37342701342283, 1.2649433724832215], "isController": false}, {"data": ["017. Home - /web/dist/fonts/bootstrap-icons.woff2", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 602.1023084170854, 2.9836683417085426], "isController": false}, {"data": ["039. Login - /web/index.php/buzz/photo/9", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 590.2353185386473, 2.9296875], "isController": false}, {"data": ["014. Home - /web/dist/img/blob.svg", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 17.5054022606383, 6.47232380319149], "isController": false}, {"data": ["048. Recruitment - /web/index.php/api/v2/recruitment/candidates/statuses", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 9.36612215909091, 3.678755326704546], "isController": false}, {"data": ["059. Add - /web/index.php/pim/viewPhoto/empNumber/7", 3, 0, 0.0, 173.33333333333334, 170, 178, 172.0, 178.0, 178.0, 178.0, 0.487012987012987, 8.4228515625, 0.30438311688311687], "isController": false}, {"data": ["040. Login - /web/index.php/pim/viewPhoto/empNumber/9", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 114.80353860294117, 3.642003676470588], "isController": false}, {"data": ["030. Login - /web/index.php/api/v2/dashboard/shortcuts", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 8.349609375, 3.4722222222222223], "isController": false}, {"data": ["075. Save - /web/index.php/pim/viewPhoto/empNumber/7", 3, 0, 0.0, 176.0, 169, 182, 177.0, 182.0, 182.0, 182.0, 0.4903563255966002, 8.480674342105262, 0.3079092942955214], "isController": false}, {"data": ["062. Add - /web/index.php/api/v2/leave/holidays", 3, 0, 0.0, 176.33333333333334, 173, 183, 173.0, 183.0, 183.0, 183.0, 0.4873294346978557, 1.5267117446393763, 0.29506274366471735], "isController": false}, {"data": ["019. Login - /web/index.php/auth/validate-1", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 13.733460022522522, 3.373979448198198], "isController": false}, {"data": ["031. Login - /web/index.php/api/v2/buzz/feed", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 18.700132978723403, 3.267328789893617], "isController": false}, {"data": ["056. Recruitment - /web/index.php/api/v2/leave/holidays", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 17.026154891304348, 3.301205842391304], "isController": false}, {"data": ["027. Login - /web/index.php/pim/viewPhoto/empNumber/7", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 103.56240643712574, 3.7074288922155687], "isController": false}, {"data": ["044. Recruitment - /web/index.php/pim/viewPhoto/empNumber/7", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 102.33681582840237, 3.7097818047337277], "isController": false}, {"data": ["019. Login - /web/index.php/auth/validate-0", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 4.133450255102041, 1.891342474489796], "isController": false}, {"data": ["019. Login - /web/index.php/auth/validate", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 7.11671633941094, 2.3503243338008417], "isController": false}, {"data": ["057. Add - /web/index.php/recruitment/addCandidate", 3, 0, 0.0, 201.33333333333334, 198, 206, 200.0, 206.0, 206.0, 206.0, 0.48504446240905413, 1.5072377728375101, 0.32778395311236863], "isController": false}, {"data": ["028. Login - /web/index.php/api/v2/dashboard/employees/time-at-work", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 13.119006283068783, 3.689236111111111], "isController": false}, {"data": ["077. Save - /web/index.php/api/v2/recruitment/candidates/101/actions/allowed", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 7.357108160621761, 3.1017244170984455], "isController": false}, {"data": ["023. Login - /web/dist/fonts/nunito-sans-v6-latin-ext_latin-300.woff2", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 251.0044642857143, 5.831473214285714], "isController": false}, {"data": ["055. Recruitment - /web/index.php/api/v2/leave/workweek", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 7.790677374301676, 3.2624825418994416], "isController": false}, {"data": ["035. Login - /web/index.php/events/push", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 7.663080601092896, 3.634093237704918], "isController": false}, {"data": ["058. Add - /web/index.php/core/i18n/messages", 3, 0, 0.0, 183.0, 177, 188, 184.0, 188.0, 188.0, 188.0, 0.48661800486618007, 48.81117574006488, 0.28180124695863745], "isController": false}, {"data": ["038. Login - /web/index.php/pim/viewPhoto/empNumber/11", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 129.84933035714286, 3.543526785714286], "isController": false}, {"data": ["054. Recruitment - /web/index.php/api/v2/leave/holidays", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 15.98373724489796, 3.0990911989795915], "isController": false}, {"data": ["053. Recruitment - /web/index.php/api/v2/leave/workweek", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 7.8787076271186445, 3.2993467514124295], "isController": false}, {"data": ["072. Save - /web/index.php/api/v2/recruitment/candidates", 3, 0, 0.0, 188.0, 181, 194, 189.0, 194.0, 194.0, 194.0, 0.49019607843137253, 0.7123161764705882, 0.4294002757352941], "isController": false}, {"data": ["034. Login - /web/index.php/api/v2/dashboard/employees/locations", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 9.210095434131736, 3.8009917664670656], "isController": false}, {"data": ["080. Save - /web/index.php/api/v2/recruitment/candidates/102/history", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 10.190902217741936, 3.596480174731183], "isController": false}, {"data": ["081. Save - /web/index.php/api/v2/leave/holidays", 3, 0, 0.0, 182.0, 179, 188, 179.0, 188.0, 188.0, 188.0, 0.4880429477794046, 1.5289470473401658, 0.29692456686188384], "isController": false}, {"data": ["018. Home - /web/dist/fonts/nunito-sans-v6-latin-ext_latin-600.woff2", 1, 0, 0.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 274.00128865979383, 6.312419458762887], "isController": false}, {"data": ["074. Save - /web/index.php/core/i18n/messages", 3, 0, 0.0, 176.33333333333334, 172, 183, 174.0, 183.0, 183.0, 183.0, 0.491480996068152, 49.29768773550131, 0.2860572984927916], "isController": false}, {"data": ["060. Add - /web/index.php/api/v2/leave/workweek", 3, 0, 0.0, 180.0, 176, 185, 179.0, 185.0, 185.0, 185.0, 0.4867759208177836, 0.6788242333279246, 0.28331879766347556], "isController": false}, {"data": ["047. Recruitment - /web/index.php/api/v2/recruitment/vacancies", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 10.552300347222223, 3.803168402777778], "isController": false}, {"data": ["049. Recruitment - /web/index.php/api/v2/recruitment/hiring-managers", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 9.159842914438503, 3.4832469919786098], "isController": false}, {"data": ["021. Login - /web/index.php/core/i18n/messages", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 484.5872961956522, 2.755132850241546], "isController": false}, {"data": ["005. Home - /web/index.php/auth/login", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 13.049506152849741, 2.924627590673575], "isController": false}, {"data": ["010. Home - /web/index.php/core/i18n/messages", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 212.92379909766456, 1.2004876592356688], "isController": false}, {"data": ["046. Recruitment - /web/index.php/api/v2/admin/job-titles", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 29.676649305555557, 3.559027777777778], "isController": false}, {"data": ["043. Recruitment - /web/index.php/core/i18n/messages", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 551.1514852335165, 3.1926081730769234], "isController": false}, {"data": ["077. Save - /web/index.php/api/v2/recruitment/candidates/102/actions/allowed", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 6.926448170731708, 2.92016006097561], "isController": false}, {"data": ["082. Logout - /web/index.php/auth/logout-1", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 12.970753205128204, 3.400440705128205], "isController": false}, {"data": ["082. Logout - /web/index.php/auth/logout-0", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 5.5893200069832405, 1.7294430865921788], "isController": false}, {"data": ["045. Recruitment - /web/index.php/api/v2/recruitment/candidates", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 49.34779575892857, 2.5669642857142856], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 96, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
