# Lab 4: Analyzing Alerts and Audit Reports

## Before You Begin
### Objectives
- View and close alerts
- Analyze open alerts from the dashboard
- View all audit records for the past week
- View a summary of audit events collected and alerts raised
- Create a failed logins report

### Requirements
To complete this lab, you need to have the following:
- Login credentials and a tenancy name for the Oracle Cloud Infrastructure Console
- Oracle Data Safe enabled in a region of your tenancy
- A registered target database in Oracle Data Safe with sample data
- Audit collection started on your target database in Oracle Data Safe. If not, see [Lab 2: Provision Audit and Alert Policies](../Lab2/LabGuide2.md)

### Assumptions
This lab assumes that you are signed in to the Oracle Data Safe Console. If not, see [Lab 1: Viewing a Registered Target Database](../Lab1/LabGuide1.md), steps 1 and 2.

Your data values may be different than those shown in the screenshots in this lab.

## **STEP 1**: View and close alerts

- In Oracle Data Safe Console, click the **Home** tab, and then click the **Alerts** tab.

  ![](./img/click-alerts-tab.png " ")


- At the top of the **All Alerts** page, click **Summary**.

  ![](./img/alerts-page-summary.png " ")



-  View the totals for target databases, critical alerts, high risk alerts, medium risk alerts, and open alerts.

   At a glance, you can better understand whether the security of your database is in jeopardy and how you should prioritize your work.

   ![](./img/all-alerts-totals.png " ")


- Scroll down to review the alerts in the table.

  The **DB User** column identifies who is doing the action.

  The **Operation** column identifies the action.

  The **Alert Severity** column indicates how serious the action is.

  ![](./img/alerts-table.png " ")


- At the bottom of the page, click the page numbers to view other pages of alerts.

  ![](./img/alerts-navigate-pages.png " ")



- To filter the report to show only critical alerts, at the top of the report, click **Filters**. Set the filter to be: **Alert Severity = Critical**, and then click **Apply**.

  ![](./img/filter-critical-alerts.png " ")


- Position the cursor over the **DB User** column and click the up arrow button to sort the column.

  ![](./img/sort-column-alerts.png " ")


- Notice that there are several failed logins by the `DBA_DEBRA` user.

  ![](./img/failed-logins-dbdebra.png " ")


- Click the **Alert ID** for the first failed login alert for `DBA_DEBRA` to view more detail.

  ![](./img/alert-id-dbdebra.png " ")

- Review the information in the **Alert Details** dialog box, and then click **X** to close it.

  You can view the **OS User**, **Client Host**, **Client Program**, **Client IP**, **Operation Time**, and much more.

  ![](./img/alert-details.png " ")


- Click the **X** to remove the filter.

  ![](./img/remove-filter-alert.png " ")


- Create two filters to find out if the user `EVIL_RICH` is making any user entitlement changes.

   To create the first filter, click **+ Filter** and set the filter to be: **Alert = User Entitlement Changes**.

   To create the second filter, click **+Filter**, and set the filter to be: **DB User = EVIL_RICH**. Click **Apply**.

   ![](./img/two-filters-alerts.png " ")


- Notice that there are several alerts. Click the **Alert ID** for the first alert.

  ![](./img/alerts-for-evil-rich.png " ")


- Scroll down in the **Alert Details** dialog box. Notice that `EVIL_RICH` tried to execute the SQL command: `grant PDB_DBA to ATILLA`, but failed. Close the dialog box.

  ![](./img/sql-text-failed1.png " ")


- Open the other **Alert IDs** for `EVIL_RICH`. Notice that the SQL text is similar in that the failed grants are for the `ATILLA` user.

  Suppose you take appropriate action. Now you can close the alerts. To do so, in the **Alert Status** column, select **Closed** for each alert.

  ![](./img/closed-alerts.png " ")


- To hide closed alerts, move the **Open Alerts only** slider to the right.

  ![](./img/hide-closed-alerts.png " ")



## **STEP 2**: Analyze open alerts from the dashboard


- Click the **Home** tab.


   ![](./img/click-home-tab.png " ")


- Review the information in the charts on the dashboard.

  Note: There is no data for Data Discovery and Data Masking because you have not yet used those features.

  ![](./img/dashboard-with-activity.png " ")


- In the **Open Alerts** chart, notice that the chart shows the number of open alerts for the last 7 days. Click the last node in the chart.

  ![](./img/open-alerts-chart-dashboard.png " ")


- In the **Open Alerts** dialog box, view the number of open alerts for the last 7 days.



  ![](./img/open-alerts-dialog-box.png " ")


- Hover over the counts to view the number of **Critical**, **High**, and **Medium** alerts for each day.

  ![](./img/most-critical-alerts.png " ")


- Click the name of your target database to open the **All Alerts** report.

  ![](./img/click-target-database-name.png " ")


- Notice that the **All Alerts** report is filtered to show only the open alerts for your target database for the past 7 days.

  ![](./img/all-alerts-report-filtered.png " ")


## **STEP 3**: View all audit records for the past week

- Click the **Reports** tab.

  ![](./img/click-reports-tab.png " ")


- On the left, expand **Audit Reports** (if needed), and then click the **All Activity** report.

   ![](./img/click-all-activity-report.png " ")


- At the top of the report, view the totals for **Targets**, **DB Users**, **Client Hosts**, **Login Success**, **Login Failures**, **User Changes**, **Privilege Changes**, **DDLs**, and **DMLs**.



  ![](./img/all-activity-report-past-week.png " ")


- If the filters are not displayed, click **Filters**.

  ![](./img/click-filters.png " ")


- Notice that the report is automatically filtered to show one week's worth of audit data for your target database.



  ![](./img/all-activity-report-filtered-for-one-week.png " ")




## **STEP 4**: View a summary of audit events collected and alerts raised

- On the left, click **Summary Reports**, and then click **Audit Summary**.

  The **Audit Summary** report helps you to gain an understanding of the activity trends of your target databases. By default, the report shows you data for all of your target databases for the past week.

   ![](./img/click-audit-summary.png " ")


- View the totals to learn how many target databases are represented in the charts, how many users are audited, and how many client hosts have connected to your target database.

  The report is filtered to show data for the last week.


  ![](./img/audit-summary-report.png " ")



- View the charts.

  The **Open Alerts** chart compares the number of critical, high, and medium open alerts for the past week.

  The **Admin Activity** chart compares the number of logins, database schema changes, audit setting changes, and entitlement changes for the past week.

  The **Login Activity** chart compares the number of failed and successful logins for the past week.

  The **All Activity** chart compares the total number of events for the past week.

   ![](./img/audit-summary-charts.png " ")


- To filter the time period for the report, at the top, select **Last 1 Month** and click **Apply**.

   ![](./img/filter-last-1-month.png " ")


- To filter the target database for the report, click **All Targets**.

  ![](./img/click-all-targets.png " ")


- In the **Select Targets** dialog box, deselect the check box for **All Targets**, click the field and select your target database, and then click **Done**.

   ![](./img/select-targets-dialog-box.png " ")


- Notice that your target database is set as a filter.

  ![](./img/target-set-as-filter.png " ")




## **STEP 5**: Create a failed logins report

- Click the **Reports** tab.

  ![](./img/click-reports-tab2.png " ")



- In the list under **Audit Reports**, click **Login Activity**.

  ![](./img/click-login-activity.png " ")



- In the **Login Activity** report, set a filter by selecting **Operation Status = FAILURE** (no quotes). Click **Apply**.

  ![](./img/filter-login-activity-report.png " ")


- Notice that the report shows only failed logins.


   ![](./img/failed-logins-only.png " ")


- From the **Report Definition** menu, select **Save As New**.

  ![](./img/report-definition-save-as-new.png " ")


- In the **Save As** dialog box, enter the report name **Failed Logins**, enter **Failed logins report** for the description, select your resource group, and then click **Save As**. A confirmation message states "Successfully created the report."

  ![](./img/save-as-failed-logins.png " ")



- Click the **Reports** tab.

  ![](./img/click-reports-tab3.png " ")



- At the top of the list under **Custom Reports**, click **Failed Logins**.

  ![](./img/custom-report-failed-logins.png " ")



- Click **Generate Report**.

  ![](./img/click-generate-report.png " ")


- In the **Generate Report** dialog box, leave **PDF** selected, select your resource group, and then click **Generate Report**.

  ![](./img/generate-report-dialog-box.png " ")

- Wait for a confirmation message that states that the report was generated successfully.

  ![](./img/report-confirmation.png " ")


- Click **Download Report**.

  ![](./img/click-download-report.png " ")



- In the **Opening Failed Logins.pdf** dialog box, click **Save File**, and then click **OK**.

  The PDF is downloaded to your browser.

  ![](./img/opening-failed-logins-pdf-dialog-box.png " ")


- Click the downloaded **Failed Logins.pdf** file to view it in Adobe Acrobat.

  ![](./img/click-downloaded-report.png " ")



- View the report, and then close it.

  ![](./img/failed-logins-pdf.png " ")