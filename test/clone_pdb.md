# Clone PDBs using DBCA in Silent Mode

## Before You Begin

This 15-minute tutorial shows you how to use Database Configuration Assistant (DBCA) to clone a remote pluggable database (PDB) into a container database (CDB).

### Background

In Oracle Database 18c, cloning a remote PDB requires several commands to be executed.

### What Do You Need?

- Oracle Database 19c installed
- Two CDBs: ORCL with PDB1 and CDB19, both in archivelog mode. You can use the dbca.sh shell script to create CDB19. Download the shell script to the labs directory created on your server /home/oracle/labs. Replace the password in the shell script by your own complex password. PDB relocation PDB and remote PDB clone operations with DBCA do not support Oracle Managed Files (OMF) enabled CDB. Verify that the PDB to be cloned does not use OMF.
- HR schema installed in PDB1 as an example of application tables. If you want to use the HR.EMPLOYEES table, use the [hr.sql](<https://docs.oracle.com/en/database/oracle/oracle-database/19/clone-pdbs-using-dbca-silent-mode/files/hr.sql>). Download the SQL script to the labs directory created on your server /home/oracle/labs. In the script, update the password of the user connected to the database.

## Prepare the PDB Before Cloning

1. Log in to PDB1 in `ORCL` as `SYSTEM`.

    ```
    <copy>sqlplus system@PDB1</copy>
    Enter password: *password*
    ```

2. Use the [hr.sql](<https://docs.oracle.com/en/database/oracle/oracle-database/19/clone-pdbs-using-dbca-silent-mode/files/hr.sql>) script to create the `HR` user and `EMPLOYEES` table in PDB1.

    ```
    <copy>@/home/oracle/labs/hr.sql</copy>
    ```

3. Verify that `PDB1` contains the `HR.EMPLOYEES` table.

    ```
    <copy>SELECT count(*) FROM hr.employees;</copy>

    COUNT(*)
    ----------
            107
    ```

4. Connect to `ORCL` as `SYSTEM`.

    ```
    <copy>CONNECT system@ORCL</copy>
    Enter password: *password*
    ```

5. Create a common user in `ORCL`, used in the database link automatically created in `CDB19` to connect to `ORCL` during the cloning operation.

    ```
    <copy>CREATE USER c##remote_user IDENTIFIED BY password CONTAINER=ALL;</copy>
    ```

6. Grant the privileges.

    ```
    <copy>GRANT create session, create pluggable database TO c##remote_user CONTAINER=ALL;</copy>
    ```

7. Quit the session.

    ```
    EXIT
    ```


## Use DBCA to Clone a Remote PDB

In this section, you use `DBCA` in silent mode to clone `PDB1` from `ORCL` as `PDB19` in `CDB19`.

1. If `CDB19` does not exist, launch the `/home/oracle/labs/dbca.sh` shell script. The script creates the CDB with no PDB. In the script, update the password of the user connected to the database.

    ```
    <copy>/home/oracle/labs/dbca.sh</copy>
    ```

2. Launch `DBCA` in silent mode to clone `PDB1` from `ORCL` as `PDB19` in `CDB19`.

    ```
    <copy>dbca -silent -createPluggableDatabase -createFromRemotePDB -remotePDBName PDB1 -remoteDBConnString ORCL -remoteDBSYSDBAUserName SYS -remoteDBSYSDBAUserPassword password -sysDBAUserName sys -sysDBAPassword password -dbLinkUsername c##remote_user -dbLinkUserPassword password -sourceDB CDB19 -pdbName PDB19</copy>
    ```

    ```
    Prepare for db operation 
    50% complete
    Create pluggable database using remote clone operation
    100% complete
    Pluggable database "PDB19" plugged successfully.
    Look at the log file "/u01/app/oracle/cfgtoollogs/dbca/CDB19/PDB19/CDB19.log" for further details.
    ```


## Check that the PDB Is Cloned

1. Connect to CDB19 as SYS.

    ```
    <copy>sqlplus sys@CDB19 AS SYSDBA</copy>
    Enter password: password
    ```

    ```
    <copy>SHOW PDBS</copy>
	CON_ID 	   CON_NAME                       OPEN MODE  RESTRICTED
    ---------- ------------------------------ ---------- ----------
             2 PDB$SEED                       READ ONLY  NO
             3 PDB19                          READ WRITE NO
    ```

2. Check that PDB19 contains the HR.EMPLOYEES table as in PDB1.

    ```
    <copy>CONNECT hr@PDB19</copy>
    Enter password: password
    ```

    ```
    <copy>SELECT count(*) FROM employees;</copy>

    COUNT(*)
    ----------
          107
    ```


## Clean Up the PDB Cloned

1. Connect to `CDB19` as `SYS`.

    ```
    <copy>CONNECT sys@CDB19 AS SYSDBA</copy>
    Enter password: *password*
    ```

2. Close `PDB19`.

    ```
    <copy>ALTER PLUGGABLE DATABASE pdb19 CLOSE;</copy>
    ```

3. Drop `PDB19`.

    ```
    <copy>DROP PLUGGABLE DATABASE pdb19 INCLUDING DATAFILES;</copy>
    ```

4. Quit the session.

    ```
    EXIT
    ```

<!-- Downloaded from Tutorial Creator on Tue Dec 03 2019 19:50:07 GMT+0530 (India Standard Time) -->