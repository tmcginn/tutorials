# Lab 400: Create Data Visualizations
![](./img/001.png)

## Introduction
In this Lab you will assume the persona of Emma, the marketing analyst.  She will be using Oracle Advanced Analytics to review current and historical sales patterns, and use the results of Heather's (data scientist) machine learning to support a new marketing project that targets high value/high credit customers.  She is working with others on her team, some of which have already been using Oracle Advanced Analytics to review sales data.  She wants to review the Data Visualization content before creating some insights herself.  She will begin by importing content from another analyst and reviewing sales perspectives, and will then build out visualizations on the sales credit machine learning results that were created by Heather.

In Lab 100 you created an Oracle Machine Learning instance as part of the setup, and then went on to the rest of Lab 100.  The instance should now be available.

To log issues and view the Lab Guide source, go to the [github oracle](https://github.com/oracle/learning-library/tree/master/workshops/adwc4dev) repository.

### Objectives
- Log into Oracle Advanced Analytics and import the Sales.dva project.
- Review the pre-built dashboards that sales information for the past four years.
- Upload your ADWC wallet and create a new ADWC connection.
- Create new credit_scoring_100k datafile.
- Create content on credit scoring data

### Required Artifacts
- A Trial Account

## Review Sales History

### **STEP 1: Sign in to Oracle Analytics Cloud and import the Sales.dva project.**

- You should already be familiar with the Cloud Console Login.  After logging in you land on the Dashboard.  Select `Oracle Analytics Cloud`.

  ![](./img/002.png)

  ![](./img/003.png)

- Click on the menu on the far right and select `Oracle Analytics Cloud URL`.

  ![](./img/004.png)

- You end up on the main OAC page.  Click on the menu in the upper right to expand the menu.

  ![](./img/005.png)

- We will create a new project by importing and existing saved project.  Select `Project` on the left.

  ![](./img/006.png)

- Select `All Projects` in your current workspace.

  ![](./img/007.png)

- Select `Import Project` from the menu in the upper right.

  ![](./img/008.png)

- Select Sales.dva files from the `install` directory in git and import.  The password is `Admin123`.

  ![](./img/009.png)

  ![](./img/010.png)

  ![](./img/011.png)

  ![](./img/012.png)

### **STEP 2: Review the pre-built dashboards that sales information for the past four years.**

- Select the imported project `Sales History`.

  ![](./img/013.png)

- Review content created and shared by the marketing analyst.  Note that we are viewing the `Visualize` perspective.  There is also the `Prepare` and `Narrate` perspectives.  Select the `Narrate` perspective.

  ![](./img/014.png)

- Page through the canvasses left to right.  Note that Customer Profitabliity is of particular interest to Emma as it relates to her new marketing project.  As Emma is new to OAC this is a good way to get a feel for the different visualizations.

  ![](./img/015.png)

  ![](./img/016.png)

  ![](./img/017.png)

- When she lands on the `Performance` canvass she hovers over some of the various offices.  Vancouver has 117 offices while Victoria has 119 offices, but is far less profitable.  This region will be the initial focus of the marketing campaign.  She makes a note to Heather to talk about future machine learning analysis to learn why this might be.

  ![](./img/018.png)

- Create a new note for Heather - select the note icon.  Enter `Hey Heather, can you take a look at these offices and learn why the profit varies so much independent of the customer base?`.

  ![](./img/019.png)

- Select the remaining canvasses.

  ![](./img/020.png)

  ![](./img/021.png)

- She notes there are a couple of other interesting canvasses that were created but not selected.  Drag and drop the `Top Countries` and `Diagram` canvasses to the bottom.
 ![](./img/022.png)

  ![](./img/023.png)

### **STEP 3: Upload your ADWC wallet and create a new ADWC connection.**

- Go back to the menu on the top left and then select the `Console` on the left.

  ![](./img/024.png)

- Select `Manage Connections`, and then `Upload Wallet`.  If you have previously uploaded a wallet it will say `Replace Wallet`.  Select `Proceed without a virus scanner`. 

  ![](./img/025.png)

  ![](./img/026.png)

  ![](./img/026.1.png)

- Select the wallet you downloaded in Lab 100.

  ![](./img/027.png)

  ![](./img/028.png)

  ![](./img/029.png)

- Create new connection.  You will need to get the details for the connection in the tnsnames.ora file that was in the wallet.  Open the tnsnames.ora file.  Note the port, host, and service name.  These will be used to create new connection.  Leave the notepad open for the following steps.

  ![](./img/030.png)

- Go back to the previous tab, select the drop down menu, and select `Data`, and then `Connections`.  Select `Create`.

  ![](./img/034.png)

- Select `Connection`, and then `Autonomous Data Warehouse Cloud`.

  ![](./img/032.png)

  ![](./img/033.png)

- Enter details from the tnsnames string (from unzipping the wallet).

  ![](./img/034.png)

  ![](./img/035.png)

### **STEP 4: Create Data Sets.**

- Go back to the top menu, select `Data`, and then select the `Data Sets` tab and then select `Create`.

  ![](./img/036.png)

- Select the `adwc` connect you just created.

  ![](./img/037.png)

- Select the `ADWC_WS` schema.

  ![](./img/038.png)

- Select the `AI_EXPLAIN_OUTPUT_CREDIT_SCORE_BIN` table, then `Add All` and then `Add`.

  ![](./img/039.png)

  ![](./img/040.png)

- Select the `<` icon to create the next data set.

  ![](./img/040.1.png)

- Select `Create` again and repeat the process for the remaining data sets.

  ![](./img/041.png)

- Select the `adwc` data source and the `ADWC_WS` schema (as above), and then repeat the above steps for the following tables
  - `AI_EXPLAIN_OUTPUT_MAX_CC_SPENT_AMOUNT`
  - `CREDIT_SCORING_100K_V`
  - `CREDIT_SCORE_NEW_PREDICTIONS`
  - `N1_LIFT_TABLE`

- We need to make some adjustments to default table definitions.  Hover over the `N1_LIFT_TABLE`, select the menu on the far right, and then select `Inspect`.

  ![](./img/042.png)

- Select `Data Elements`, and then change the first attribute `QUANTILE_NUMBER` to an attribute.

  ![](./img/043.png)

  ![](./img/044.png)

- Next update `CREDIT_SCORE_NEW_PREDICTIONS` table, select `Inspect`, and change all the columns to `Attribute` (many are already this value).  You will need to scroll down to change them all.

  ![](./img/045.png)

  ![](./img/046.png)

- Lastly, update CREDIT_SCORING_10OK_V and set all values to `Attribute`.

  ![](./img/047.png)

### **STEP 5: Create Good Credit Factors Analysis.**

- Select `Projects` on the left, then `Create`.

  ![](./img/048.png)

- Hold the shift key down and select the following tables to add to our new project.

  ![](./img/049.png)

- Drag `ATTRIBUTE_NAME` and `EXPLANATORY_VALUE` from `AI_EXPLAIN_OUTPUT_CREDIT_SCORE_BIN` to the canvas.

  ![](./img/050.png)

- Next right click on `RANK` and select `Create Filter`.  Enter `0` for Start and `10` for End.

  ![](./img/051.png)

  ![](./img/052.png)

- Next right click on `EXPLANATORY_VALUE` and sort high to low.

  ![](./img/053.png)

- Rename `Canvas 1` to `Good Credit Factors`.

  ![](./img/054.png)

  ![](./img/055.png)

- Save our new project.  Click in the upper right and save the project as `Credit Risk Analysis`.

  ![](./img/056.png)

  ![](./img/057.png)

### **STEP 6: Create Max CC Limit Analysis.**

- Note this analysis is very similar to the one above.  Click on the + symbol on the bottom of the page to create a new Canvas.

  ![](./img/058.png)

- Select the following fields and drag them on to the canvas.

  ![](./img/059.png)

- Create filter by right clicking on the `RANK` attribute.  Enter `Start` of `0` and `End` of `10`.

  ![](./img/060.png)

  ![](./img/061.png)

- Right click on `EXPLANATORY_VALUE` and sort high to low.

  ![](./img/062.png)

- Rename this canvas `Max CC Limit`.

  ![](./img/063.png)

  ![](./img/064.png)

### **STEP 7: Cumulative Lift Analysis.**

- Create a new Canvas and then under N1_LIFT_TABLE right click on My Calculations and create a new one.

  ![](./img/065.png)

  ![](./img/066.png)

- Call the calculation `Chance` and enter `RSUM(.01)`.

  ![](./img/067.png)

- Drag the following fields to the canvas.

  ![](./img/068.png)

- Change the visualization to a line chart and move the three values (`Chance`, `QUANTILE_NUMBER`, and `GAIN_CUMULATIVE`) to the postions noted below.

  ![](./img/069.png)

- Click on the visualization pallet on the far left and select Text Box.  Drag this to a position above the chart.

  ![](./img/070.png)

- Double click on the text box and enter `Cumulative Lift`.  Then hightlight the text and set the font to 20.

  ![](./img/071.png)

- Double click on the text box again and enter the following.  Set the font size to 12:
```
Cumulative lift is a measure of how much better prediction results are using a model than could be obtained by chance. For example, suppose that 2% of the customers mailed a catalog make a purchase; suppose also that when you use a model to select catalog recipients, 10% make a purchase. Then the lift for the model is 10/2 or 5. Lift may also be used as a measure to compare different data mining models. Since lift is computed using a data table with actual outcomes, lift compares how well a model performs with respect to this data on predicted outcomes. Lift indicates how well the model improved the predictions over a random selection given actual results. Lift allows a user to infer how a model performs on new data.
```
- Change the Canvas name to `Cumulative Lift`.

  ![](./img/072.png)

  ![](./img/073.png)

- Save your project periodically.

  ![](./img/074.png)

### **STEP 8: Create Demographic Analysis.**

- Right click on the `+` icon at the bottom of the page and create a new canvas, then right click on `My Calculations` under `CREDIT_SCORE_NEW_PREDICTIONS` and create a new calculation.

  ![](./img/075.png)

- Call the calculation `Row Count` and double click on `Count*` under `Aggregate`.

  ![](./img/076.png)

  ![](./img/077.png)

- Expand `CREDIT_SCORE_NEW_PREDICTIONS` and select `PROB_GOOD_CREDIT` and `Row Count`.  Drag these onto the canvas.

  ![](./img/078.png)

- Change the visualization to  `Table` and then right click on `PROB_GOOD_CREDIT` and select `Create Filter`.

  ![](./img/079.png)

- Select all values below 50, and then right click on the hamburger menu and select `Exclude Selections`.

  ![](./img/080.png)

- Select the visualization menu on the far left and select a new pie chart visualization

  ![](./img/081.png)

- Drag it to the right.

  ![](./img/082.png)

- Click on the pie chart area, and then on the data elements icon on the far left, and drag the items as follows.

  ![](./img/083.png)

- Click ont the pie chart and set `Data Values` on the left to values.

  ![](./img/084.png)

- Optional - right click on items and select `CREATE FILTER`.

  ![](./img/085.png)

- Select the visualization icon on the left,scroll down and select `Text Box` and drag that to the top.  

  ![](./img/086.png)

- Double click inside the text box and enter the title `Probability of Good Credit Given Various Demographic Factors`.  Set the font size to 20.  Then add the following: `This shows the probability of good credit for various demographic factors.  Adjust the filters above to gain an understanding of what is likely to result in good credit.`

  ![](./img/087.png)

- Name the canvas `Demographic Analysis`.

  ![](./img/088.png)

### **STEP 9: Analyze Other Factors in the Credit Scoring Data.**

We have been looking at a sub-set of the factors used to predict good credit, which are in the `CREDIT_SCORE_NEW_PREDICTIONS` table.  We will analyze other factors in the `CREDIT_SCORING_100K_V` data set so we can use any of the large number of other factors that were processed.

- Create a new canvas, expand the `CREDIT_SCORING_100K_V` on the left, and drag `PROB_GOOD_CREDIT`, `Row Count`, and `Credit History` onto the canvas.  Set the visualization to `Pivot`.

  ![](./img/089.png)

- Add a filter on `PROB_GOOD_CREDIT`.  Right click on the field and then click on all values over 50.  

  ![](./img/090.png)

  ![](./img/091.png)

- Also right click on `CREDIT_HISTORY` and click outside the box to default to selecting all values.

  ![](./img/092.png)

  ![](./img/093.png)

  ![](./img/094.png)

- Next add a new visualization - select treemap and drag it to underneath the pivot table.

  ![](./img/095.png)

- Select the Treemap visualization and then select data elements.  Drag the items as follows:

  ![](./img/096.png)

### **STEP 10: Explore Other Interesting Visualizations That Help Better Understand the Information.**

- Create a new canvas.  Drag `FAMILY_SIZE`, `PROB_GOOD_CREDIT`, and `ROW_COUNT` onto the canvas.  Select `Network` as the visualization.  

  ![](./img/097.png)

- Since we want to focus on higher probabilies, create a filter on `PROB_GOOD_CREDIT` and select everything over 50.

  ![](./img/098.png)

  ![](./img/099.png)

  ![](./img/100.png)

- Lets add one more dimension - `RESIDENTIAL STATUS`.  Drag this to `Category`

  ![](./img/101.png)

- Now focus on those with near perfect predictability for Good Credit.  Right click on the 100 node and select `Keep Selected`.

  ![](./img/102.png)

  ![](./img/103.png)

- This tells us that customers that are home owner with 2 - 3 children generally have good credit.

- At this point we can drill to the individual customer_ids and execute a marketing campaign, or do further analysis.  The wide variety of visualizations combined with Oracle Machine Learning offer endless ways to identify interesting data patterns that support a wide variety of business applications.  In this case Emma can focus her limited marketing budget on activities that maximize the effectiveness of sales promotions. 

## Conclusion

Congratulations! You have completed the lab.