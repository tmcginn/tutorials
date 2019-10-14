# Create a Table in Oracle NoSQL Database Cloud Service Using Java
## ![section 0](img/32_begin.png)Before You Begin

This 15-minute tutorial walks you through the steps to connect to Oracle NoSQL Database Cloud Service and create a table using a sample application.

### Background

Oracle NoSQL Database Cloud Service is a fully managed database cloud service that is designed to handle large amounts of data at high velocity. Developers can start using this service in minutes by following the simple steps outlined in this tutorial.

To get started with the service, you create a table.

After you subscribe to Oracle Cloud, you can easily populate a table in the Oracle NoSQL Database Cloud Service by following these steps:

*   Copying client credentials
*   Updating your application with the credentials
*   Executing the application to connect to the service and creating a table

### What Do You Need?

*   Download and install the Oracle NoSQL Database Cloud Service Java Driver from the [Oracle Technology Network](http://www.oracle.com/technetwork/topics/cloud/downloads/index.html#nosqlsdk).
*   Access the [Java API Reference Guide](https://docs.oracle.com/en/cloud/paas/nosql-cloud/csnjv/index.html) to reference Java driver packages, methods, and interfaces.
*   Have an Oracle Cloud subscription with account administrator or application administrator privilege. You can either create a [free trial account](https://cloud.oracle.com/en_US/tryit) or buy a [paid subscription](https://myservices.us.oraclecloud.com/mycloud/signup?selectedPlan=PAYG&language=en&sourceType=_ref_coc-asset-opcHome) by navigating to [cloud.oracle.com](https://cloud.oracle.com/en_US/nosql).
*   Perform the steps in the [Get Started with Oracle NoSQL Database Cloud Service tutorial](https://apexapps.oracle.com/pls/apex/f?p=44785:112:::NO::P112_CONTENT_ID:24207).

* * *

## ![section 1](img/32_1.png)Access Client Credentials

To connect your application to the Oracle NoSQL Database Cloud Service, you should obtain the client id, client secret, and IDCS URL.

Perform the following steps to find your client credentials. Save these credentials in an editor of your choice. You will need them to update the `HelloWorld.java` application in the next section.

1.  Sign in to your Oracle Cloud account by accessing the link from your welcome email.
2.  The Oracle Cloud My Services page opens up for you.

    ![My Services page](img/cloud_my_services.png "My Services page")

3.  To access the Identity Console, click ![Navigation icon](img/navigation_icon.png) and then click Users. In the User Management page, click Identity Console.

    ![IDCS page](img/idcs_page.png "IDCS page")

4.  In the Oracle Identity Cloud Services page, click ![Navigation icon](img/navigation_icon.png) and then click Applications.

    ![Applications page](img/applications_page.png "Applications page")

5.  In the Applications page, click **NoSQLClient**.

    If **NoSQLClient** is not listed in the applications page, you must perform the steps in the Access Client Credentials section of the [Get Started with Oracle NoSQL Database Cloud Service tutorial](https://docs.oracle.com/en/cloud/paas/nosql-cloud/gsans/index.html#AccessClientCredentials).

6.  In the NoSQLClient application page, click **Configuration**. From the **General Information** section, obtain the **Client ID** and **Client Secret** credentials.

7.  Next, copy the IDCS URL from the browser’s address bar. Copy up to **_https://idcs-xxx.identity.oraclecloud.com_**. Paste the URL to the text file for use in the next step.

* * *

## ![section 2](img/32_2.png)Update the Sample Application

1.  Copy the `HelloWorld.java` application to an editor of your choice. You will be using this application to connect to Oracle NoSQL Database Cloud Service and create a table.

    You can access the [Java API Reference Guide](https://docs.oracle.com/en/cloud/paas/nosql-cloud/csnjv/index.html) to reference Java classes, methods, and interfaces included in this sample application.

```
import java.net.URL;
import oracle.nosql.driver.*;
import oracle.nosql.driver.idcs.*;
import oracle.nosql.driver.ops.*;
import oracle.nosql.driver.values.MapValue;

public class HelloWorld {

	/* Name of your table */
	private static final String tableName = "HelloWorldTable";

	public static void main(String[] args) throws Exception {

		/* Set up an endpoint URL */
		URL serviceURL = new URL("https", getEndpoint(args), 443, "/");
		System.out.println("Using endpoint: " + serviceURL);

		/*
		 * Fill in the MyCredentials class below and use it to create an
		 * access token provider. This lets your application perform
		 * authentication and authorization operations to the cloud service.
		 */
		DefaultAccessTokenProvider provider =
			new DefaultAccessTokenProvider(MyCredentials.IDCS_URL,
										   false,
										   new MyCredentials(), 300000, 85400);

		/* Create a NoSQL handle to access the cloud service */
		NoSQLHandleConfig config = new NoSQLHandleConfig(serviceURL);
		config.setAuthorizationProvider(provider);
		NoSQLHandle handle = NoSQLHandleFactory.createNoSQLHandle(config);

		/* Create a table and run operations. Be sure to close the handle */
		try {
			if (isDrop(args))
				dropTable(handle); // -drop was specified
			else
				helloWorld(handle);
		} finally {
			handle.close();
		}
	}

	/**
	 * Create a table and do some operations.
	 */
	private static void helloWorld(NoSQLHandle handle) throws Exception {

		/*
		 * Create a simple table with an integer key and a single string data
		 * field and set your desired table capacity.
		 */
		String createTableDDL = "CREATE TABLE IF NOT EXISTS " + tableName +
								"(id INTEGER, name STRING, " +
								"PRIMARY KEY(id))";

		TableLimits limits = new TableLimits(1, 2, 1);
		TableRequest treq = new TableRequest().setStatement(createTableDDL).
			setTableLimits(limits);
		System.out.println("Creating table " + tableName);
		TableResult tres = handle.tableRequest(treq);

		/* The request is async, so wait for the table to become active.*/
		System.out.println("Waiting for " + tableName + " to become active");
		TableResult.waitForState(handle,tres.getTableName(),
				TableResult.State.ACTIVE, 60000, 1000);
		System.out.println("Table " + tableName + " is active");

		/* Make a row and write it */
		MapValue value = new MapValue().put("id", 29).put("name", "Tracy");
		PutRequest putRequest = new PutRequest().setValue(value)
			.setTableName(tableName);

		handle.put(putRequest);
		System.out.println("Wrote " + value);

		/* Make a key and read the row */
		MapValue key = new MapValue().put("id", 29);
		GetRequest getRequest = new GetRequest().setKey(key)
			.setTableName(tableName);

		GetResult getRes = handle.get(getRequest);
		System.out.println("Read " + getRes.getValue());

		/* At this point, you can see your table in the Identity Console */
	}

	/** Remove the table. */
	private static void dropTable(NoSQLHandle handle) throws Exception {

		/* Drop the table and wait for the table to move to dropped state */
		System.out.println("Dropping table " + tableName);
		TableRequest treq = new TableRequest().setStatement
			("DROP TABLE IF EXISTS " + tableName);
		TableResult tres = handle.tableRequest(treq);

		System.out.println("Waiting for " + tableName + " to be dropped");
		TableResult.waitForState(handle,tres.getTableName(),
				TableResult.State.DROPPED, 100000, 1000);
		System.out.println("Table " + tableName + " has been dropped");
	}

	/** Get the end point from the arguments */
	private static String getEndpoint(String[] args) {
		if (args.length > 0)
			return args[0];

		System.err.println
			("Usage: java -cp .:oracle-nosql-cloud-java-driver-X.Y/lib/* " +
			 " HelloWorld <endpoint> [-drop]\n");
		System.exit(1);
		return null;
	}

	/** Return true if -drop is specified */
	private static boolean isDrop(String[] args) {
		if (args.length < 2)
			return false;
		return args[1].equalsIgnoreCase("-drop");
	}

	/**
	 * Use this simple implementation of the CredentialsProvider interface to
	 * pass your credentials to HelloWorld. Replace the appropriate parts
	 * of MyCredentials before trying the example.
	 */
	private static class MyCredentials implements CredentialsProvider {
		static final String IDCS_URL = "EDIT: put your IDCS URL here";

		private String refreshToken;

		@Override
		public IDCSCredentials getOAuthClientCredentials() {
			return new IDCSCredentials
				("EDIT: put your IDCS client ID here",
				 "EDIT: put your IDCS client secret here"
				 .toCharArray());
		}

		@Override
		public IDCSCredentials getUserCredentials() {
			return new IDCSCredentials
				("EDIT: put your Oracle Cloud user name here",
				 "EDIT: put your Oracle Cloud password here"
				 .toCharArray());
		}

		@Override
		public void storeServiceRefreshToken(String token) {
			refreshToken = token;
		}

		@Override
		public String getServiceRefreshToken() {
			return(refreshToken);
		}
	}
}
```

2.  Update the `MyCredentials` class. Replace the values for:
    *   `IDCS_URL` with the IDCS URL that you copied from the Identity Console
    *   `getOAuthClientCredentials` with your client id and client secret
    *   `getUserCredentials` with your user name and password
3.  Save the application as `HelloWorld.java` in your local system.

* * *

## ![section 3](img/32_3.png)Execute the Sample Application and Create a Table

1.  Open Command Prompt.
2.  Build the `HelloWorld.java` application. Update `oracle-nosql-cloud-java-driver-XX.XXX` with the Java driver version number that you have downloaded.

```
$ javac -cp oracle-nosql-cloud-java-driver-XX.X/lib/nosqldriver.jar \
HelloWorld.java
```

3.  Execute the application to create a table in the Oracle NoSQL Database Cloud Service. Update the java driver version and specify the endpoint for your service.
```
$ java -cp ".:oracle-nosql-cloud-java-driver-XX.X/lib/*" \
HelloWorld <endpoint URL>
```
    For example:
```
$ java -cp ".:oracle-nosql-cloud-java-driver-19.4/lib/*" \
HelloWorld ndcs.uscom-east-1.oraclecloud.com
```

    Expected output:

```
Using endpoint: <endpoint URL>
Creating table HelloWorldTable
Waiting for HelloWorldTable to become active
Table HelloWorldTable is active
Wrote {"name":"Tracy","id":29}
Read {"name":"Tracy","id":29}
Dropping table HelloWorldTable
Waiting for HelloWorldTable to be dropped
Table HelloWorldTable has been dropped
```

4.  Navigate back in to the Identity Console. You will see `ANDC_helloworldtable` created in the Applications page.

    **Note:** Each table that you create in Oracle NoSQL Database Cloud Service will be prefixed with `'ANDC_'` in the Applications page.

    ![Table created](img/table_created.png "Table created")

5.  Delete the table by specifying the end point and the `-drop` option.

```
$ java -cp ".:oracle-nosql-cloud-java-driver-XX.X/lib/*" \
HelloWorld <endpoint URL> -drop
```

    For example:

```
$ java -cp ".:oracle-nosql-cloud-java-driver-19.4/lib/*" \
HelloWorld ndcs.uscom-east-1.oraclecloud.com -drop
```

    Expected Output:

```
Using endpoint: <endpoint URL>
Dropping table HelloWorldTable
Waiting for HelloWorldTable to be dropped
Table HelloWorldTable has been dropped
```

* * *
## ![more information](img/32_more.png)Want to Learn More?

*   [About Oracle NoSQL Database Cloud Service](http://docs.oracle.com/pls/topic/lookup?ctx=cloud&id=CSNSD-GUID-E2D61A27-24A4-4EEB-863B-B6E6C94E0B08)
*   [Oracle NoSQL Database Cloud Service page](https://cloud.oracle.com/en_US/nosql)
*   [Java API Reference Guide](https://docs.oracle.com/en/cloud/paas/nosql-cloud/csnjv/index.html)

* * *
