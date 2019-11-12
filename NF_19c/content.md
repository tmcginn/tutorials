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
sqlplus system@PDB1
Enter password: *password*
```

2. Use the [hr.sql](<https://docs.oracle.com/en/database/oracle/oracle-database/19/clone-pdbs-using-dbca-silent-mode/files/hr.sql>) script to create the `HR` user and `EMPLOYEES` table in PDB1. 

```
@/home/oracle/labs/hr.sql
```

3. Verify that `PDB1` contains the `HR.EMPLOYEES` table.

```
SELECT count(*) FROM hr.employees;

COUNT(*)
----------
        107
```

4. Connect to `ORCL` as `SYSTEM`. 

```
CONNECT system@ORCL
Enter password: *password*
```

5. Create a common user in `ORCL`, used in the database link automatically created in `CDB19` to connect to `ORCL` during the cloning operation. 

```
CREATE USER c##remote_user IDENTIFIED BY password CONTAINER=ALL;
```

6. Grant the privileges.

```
GRANT create session, create pluggable database TO c##remote_user CONTAINER=ALL;
```

7. Quit the session.

```
EXIT
```

## Use DBCA to Clone a Remote PDB

In this section, you use `DBCA` in silent mode to clone `PDB1` from `ORCL` as `PDB19` in `CDB19`.

1. If `CDB19` does not exist, launch the `/home/oracle/labs/dbca.sh` shell script. The script creates the CDB with no PDB. In the script, update the password of the user connected to the database.

```
/home/oracle/labs/dbca.sh
```

2. Launch `DBCA` in silent mode to clone `PDB1` from `ORCL` as `PDB19` in `CDB19`. 

```
dbca -silent -createPluggableDatabase -createFromRemotePDB -remotePDBName PDB1 -remoteDBConnString ORCL -remoteDBSYSDBAUserName SYS -remoteDBSYSDBAUserPassword password -sysDBAUserName sys -sysDBAPassword password -dbLinkUsername c##remote_user -dbLinkUserPassword password -sourceDB CDB19 -pdbName PDB19
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
sqlplus sys@CDB19 AS SYSDBA
Enter password: password

SHOW PDBS

    CON_ID CON_NAME                       OPEN MODE  RESTRICTED
 ---------- ------------------------------ ---------- ----------
         2 PDB$SEED                       READ ONLY  NO
         3 PDB19                          READ WRITE NO
```

2. Check that PDB19 contains the HR.EMPLOYEES table as in PDB1.

```
CONNECT hr@PDB19
Enter password: password

SELECT count(*) FROM employees;

COUNT(*)
----------
      107
```

## Clean Up the PDB Cloned

1. Connect to `CDB19` as `SYS`.

```
CONNECT sys@CDB19 AS SYSDBA
Enter password: *password*
```

2. Close `PDB19`.

```
ALTER PLUGGABLE DATABASE pdb19 CLOSE;
```

3. Drop `PDB19`.

```
DROP PLUGGABLE DATABASE pdb19 INCLUDING DATAFILES;
```

4. Quit the session.

```
EXIT
```

<!-- Downloaded from Tutorial Creator on Tue Nov 12 2019 12:21:51 GMT-0500 (Eastern Standard Time) -->