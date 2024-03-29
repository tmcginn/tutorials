# Machine Learning with Oracle Autonomous Data Warehouse

## Introduction
in this lab you will assume the persona of Heather, the data scientist/ML expert for Alphaoffice.  Heather has spent most of her time over the past couple of years extracting and preparing data for analysis.  The large volumes of data need extracting and processing mean she spends most of her time waiting for jobs to finish and very little of her time analyzing the data.  Demands from marketing are forcing a new approach whereby the data remains in the data warehouse and is processed there.  The alternative cloud solution is more complex, and has no direct out of the box processes to analyze the data in place.  She started taking a look at Oracle, and found the simple SQL commands in ADWC are familiar, and execute extremely fast, leveraging all the performance features of the platform.  Further once she is done can can apply the learning models to incoming data on the fly, and allow end user analysts to immediately see mining results.  This drastically reduces the cycle of data preparation, analysis, and publishing.  It also means there is no change to analysis/reporting Data Visualization toolset that users are familiar with.

An added benefit is the ability to use a new open source [Apache Zeppelin based collaboration environment](http://www.oracle.com/technetwork/database/options/oml/overview/index.html) where she can work with others on the team in real time, annotating ML steps and combining the processing and documentation in one place.  Since we are going to use Oracle ML interface, much of the lab will be done in that interface.  For more information on which Machine Learning Algorithms are supported see [Oracle Advanced Analytics documentation](https://docs.oracle.com/en/database/oracle/oracle-database/12.2/dmapi/mining-fuctions.html#GUID-3BC8FD92-9B6A-4612-A458-7E5FFDDC5EA7).

To log issues and view the Lab Guide source, go to the [github oracle](https://github.com/oracle/learning-library/tree/master/workshops/adwc4dev) repository.

### Objectives
- Import a Apache Zepplin notebook.
- Become familiar with Oracle Machine Learning Algorithms.
- Create a machine learning model to determine factors that predict good credit.

### Required Artifacts
- Oracle SQL Developer (see Lab 100 for more specifics on the version of SQL Developer and how to install and configure it).

## Upload Credit Score Data to Object Storage

### **STEP 1: Download files used in Lab 300 and Lab 400**

**Click to Download**

[install.zip](https://oracle.github.io/learning-library/workshops/adwc4dev/install/install.zip)

- Save the install.zip to a download directory and then unzip the file.

  ![](./img/001.2.png)

### **STEP 2: Sign in to Oracle Cloud**

- Log in, if you have not already done so.

  ![](./img/002.png)

  ![](./img/003.png)

  ![](./img/004.png)

- Select Compute.

  ![](./img/019.png)

  ![](./img/020.png)

### **STEP 3: Create bucket adwc and upload your data**

- Select the drop down menu in the upper left, scroll down and select Object Storage.

  ![](./img/022.png)

- Create a bucket called `adwc`.  Create the bucket in your compartment (not ManagedCompartmentForPaas).

  ![](./img/023.png)

  ![](./img/024.png)

- Select the `adwc` bucket and upload file `credit_scoring_100k` in git directory `ADWC4Dev/workshops/adwc4dev/install`.

  ![](./img/025.png)

  ![](./img/026.png)

  ![](./img/027.png)

  ![](./img/028.png)

  ![](./img/029.png)

- Copy the URL to a notepad for the following import process.

  ![](./img/030.png)

  ![](./img/031.png)

- To load data from the Oracle Cloud Infrastructure(OCI) Object Storage you will need an OCI user with the appropriate privileges to read data (or upload) data to the Object Store. The communication between the database and the object store relies on the Swift protocol and the OCI user Auth Token.  Go back to the menu in the upper left and select users.

  ![](./img/032.png)

- Click the user's name to view the details. Also, remember the username as you will need that in the next step.

  ![](./img/033.png)

- On the left side of the page, click Auth Tokens, and then `Generate Token`.  Call it `adwc_token`.  Be sure to copy it to a notepad.

  ![](./img/034.png)

  ![](./img/035.png)

  ![](./img/036.png)

  ![](./img/037.png)

### **STEP 4: Create a Database Credential for Your User**
- To access data in the Object Store you have to enable your database user to authenticate itself with the Object Store using your OCI object store account and Auth token. You do this by creating a private CREDENTIAL object for your user that stores this information encrypted in your Autonomous Data Warehouse. This information is only usable for your user schema.

- Connected as your user in SQL Developer, copy and paste this to SQL Developer worksheet.  Specify the credentials for your Oracle Cloud Infrastructure Object Storage service: The username will be the OCI username (which is not the same as your database username) and the OCI object store Auth Token you generated in the previous step. In this example, the crediential object named OBJ_STORE_CRED is created. You reference this credential name in the following steps.

- Paste the following into SQLDeveloper.
```
<copy>BEGIN
  DBMS_CLOUD.CREATE_CREDENTIAL(
    credential_name => 'adwc_token',
    username => '<your cloud username>',
    password => '<generated auth token>'
  );
END;
/</copy>
```
  ![](./img/038.png)

- Now you are ready to load data from the Object Store.

### **STEP 5: Loading Data Using dbms_cloud.copy_data package**

- First create your table.  Enter the following in SQLDeveloper.
```
<copy>create table admin.credit_scoring_100k 
   (	customer_id number(38,0), 
	age number(4,0), 
	income number(38,0), 
	marital_status varchar2(26 byte), 
	number_of_liables number(3,0), 
	wealth varchar2(4000 byte), 
	education_level varchar2(26 byte), 
	tenure number(4,0), 
	loan_type varchar2(26 byte), 
	loan_amount number(38,0), 
	loan_length number(5,0), 
	gender varchar2(26 byte), 
	region varchar2(26 byte), 
	current_address_duration number(5,0), 
	residental_status varchar2(26 byte), 
	number_of_prior_loans number(3,0), 
	number_of_current_accounts number(3,0), 
	number_of_saving_accounts number(3,0), 
	occupation varchar2(26 byte), 
	has_checking_account varchar2(26 byte), 
	credit_history varchar2(26 byte), 
	present_employment_since varchar2(26 byte), 
	fixed_income_rate number(4,1), 
	debtor_guarantors varchar2(26 byte), 
	has_own_phone_no varchar2(26 byte), 
	has_same_phone_no_since number(4,0), 
	is_foreign_worker varchar2(26 byte), 
	number_of_open_accounts number(3,0), 
	number_of_closed_accounts number(3,0), 
	number_of_inactive_accounts number(3,0), 
	number_of_inquiries number(3,0), 
	highest_credit_card_limit number(7,0), 
	credit_card_utilization_rate number(4,1), 
	delinquency_status varchar2(26 byte), 
	new_bankruptcy varchar2(26 byte), 
	number_of_collections number(3,0), 
	max_cc_spent_amount number(7,0), 
	max_cc_spent_amount_prev number(7,0), 
	has_collateral varchar2(26 byte), 
	family_size number(3,0), 
	city_size varchar2(26 byte), 
	fathers_job varchar2(26 byte), 
	mothers_job varchar2(26 byte), 
	most_spending_type varchar2(26 byte), 
	second_most_spending_type varchar2(26 byte), 
	third_most_spending_type varchar2(26 byte), 
	school_friends_percentage number(3,1), 
	job_friends_percentage number(3,1), 
	number_of_protestor_likes number(4,0), 
	no_of_protestor_comments number(3,0), 
	no_of_linkedin_contacts number(5,0), 
	average_job_changing_period number(4,0), 
	no_of_debtors_on_fb number(3,0), 
	no_of_recruiters_on_linkedin number(4,0), 
	no_of_total_endorsements number(4,0), 
	no_of_followers_on_twitter number(5,0), 
	mode_job_of_contacts varchar2(26 byte), 
	average_no_of_retweets number(4,0), 
	facebook_influence_score number(3,1), 
	percentage_phd_on_linkedin number(4,0), 
	percentage_masters number(4,0), 
	percentage_ug number(4,0), 
	percentage_high_school number(4,0), 
	percentage_other number(4,0), 
	is_posted_sth_within_a_month varchar2(26 byte), 
	most_popular_post_category varchar2(26 byte), 
	interest_rate number(4,1), 
	earnings number(4,1), 
	unemployment_index number(5,1), 
	production_index number(6,1), 
	housing_index number(7,2), 
	consumer_confidence_index number(4,2), 
	inflation_rate number(5,2), 
	customer_value_segment varchar2(26 byte), 
	customer_dmg_segment varchar2(26 byte), 
	customer_lifetime_value number(8,0), 
	churn_rate_of_cc1 number(4,1), 
	churn_rate_of_cc2 number(4,1), 
	churn_rate_of_ccn number(5,2), 
	churn_rate_of_account_no1 number(4,1), 
	churn_rate__of_account_no2 number(4,1), 
	churn_rate_of_account_non number(4,2), 
	health_score number(3,0), 
	customer_depth number(3,0), 
	lifecycle_stage number(38,0), 
	credit_score_bin varchar2(100 byte)
   );

	 grant select any table to public;</copy>
```
- Execute the query

  ![](./img/039.png)

- Right click on the Tables to refresh the table list.

  ![](./img/040.png)

- Enter the following code snippit.

```
<copy>begin
 dbms_cloud.copy_data(
    table_name =>'credit_scoring_100k',
    credential_name =>'adwc_token',
    file_uri_list => 'https://objectstorage.<your data center - eg us-ashburn-1>/n/<your tenant - eg dgcameron2>/adwc/o/credit_scoring_100k.csv',
    format => json_object('ignoremissingcolumns' value 'true', 'removequotes' value 'true', 'dateformat' value 'YYYY-MM-DD HH24:MI:SS', 'blankasnull' value 'true', 'delimiter' value ',', 'skipheaders' value '1')
 );
end;
/</copy>
```
- And execute it.

  ![](./img/040.1.png)

- Click on the table on the left and select the data tab to review the data.

  ![](./img/049.png)

## Log into Oracle Machine Learning

Now that Heather has loaded the data, she will log into the Oracle Cloud Console, and then into Machine Learning.

### **STEP 6: Sign in to Oracle Cloud**

- Log in, if you have not already done so.

  ![](./img/002.png)

  ![](./img/003.png)

  ![](./img/004.png)

- Select `Autonomous Data Warehouse`.

  ![](./img/005.png)

  ![](./img/006.png)

- Select the ADW database.

  ![](./img/007.png)

  ![](./img/008.png)

- Select Administration

  ![](./img/010.png)

- Select `Manage Oracle ML Users`.

  ![](./img/011.png)

- Log in as admin user and password that you assigned when you created the instance (`admin/Alpha2018___`)

  ![](./img/012.png)

- Create new ML user.  Enter user `adwc_ws` with password `Alpha2018___`.

  ![](./img/013.png)

  ![](./img/014.png)

- Select the home icon upper right.

  ![](./img/015.png)

- Log in as `adwc_ws` password `Alpha2018___`.  Before you log in you may wish to bookmark this page.

  ![](./img/016.png)

- Navigate around to get familiar with the ML pages.  Click on Examples.

  ![](./img/017.png)

- Note the various ML notebook examples.  Feel free to review some of these.  We will be creating a new ML notebook in this lab.

  ![](./img/018.png)

- Click on the upper left icon to bring back the menu.  Then select `Notebooks`.

  ![](./img/052.png)

  ![](./img/053.png)

- We will be importing a pre-built notebook, and using this for the remainder of the lab.  Select `Import`.

  ![](./img/054.png)

- Go to the `install` directory in your git repository and import the `Credit Score Predictions.json` notebook.

  ![](./img/055.png)


- Select the `Credit Score Predictions` notebook.

  ![](./img/056.png)

- Before you start working with the `Credit Score Predictions` you need to set the interpreter binding.  Click on the gear icon.

  ![](./img/056.1.png)

- Select the `orcl_high` interpreter and then Save.

  ![](./img/056.2.png)

The rest of this lab will be done interactively in the notebook.  The following area just screen shots for your convenience.

## Screen Shots of ML Notebook

  ![](./img/057.png)

  ![](./img/058.png)

  ![](./img/059.png)

  ![](./img/060.png)

  ![](./img/061.png)

  ![](./img/062.png)

  ![](./img/063.png)

  ![](./img/064.png)

  ![](./img/065.png)

  ![](./img/066.png)

  ![](./img/067.png)

  ![](./img/068.png)

  ![](./img/069.png)

  ![](./img/070.png)

  ![](./img/071.png)

  ![](./img/072.png)

  ![](./img/073.png)