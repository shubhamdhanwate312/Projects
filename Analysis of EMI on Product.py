#!/usr/bin/env python
# coding: utf-8

# # MINI Project

# In[1]:


import pandas as pd
df = pd.read_csv("EMI_DATASET.csv")
df.head()


# In[18]:


df.info()


# # Cleaning data 

# In[19]:


df.drop(['USER ID'],axis=1, inplace=True)
df.drop(['Payment Option'],axis=1, inplace=True)
df.drop(['Order Amount'],axis=1, inplace=True)
df.drop(['Product Category'],axis=1, inplace=True)
df.drop(['Order Date'],axis=1, inplace=True)


# In[17]:


df = pd.read_csv("C:/Users/SHUBHAM/OneDrive/Desktop/project/EMI_DATASET.csv")
df.head()


# In[7]:



payment_counts = df['Payment Option'].value_counts()
print(payment_counts)
avg_order_amounts = df.groupby('Payment Option')['Order Amount'].mean()
print(avg_order_amounts)


# In[5]:


import pandas as pd
import matplotlib.pyplot as plt

# Load the CSV file into a pandas dataframe
df = pd.read_csv("EMI_DATASET.csv")

# Group the data by payment option and extract the order amounts
emi_orders = df.loc[df['Payment Option'] == 'EMI', 'Order Amount']
cod_orders = df.loc[df['Payment Option'] == 'COD', 'Order Amount']

# Create a histogram of the order amounts for each payment option
plt.hist([emi_orders, cod_orders], bins=10, alpha=0.5, label=['EMI', 'COD'])
plt.legend(loc='upper right')
plt.xlabel('Order Amount')
plt.ylabel('Frequency')
plt.title('Order Amounts by Payment Option')
plt.show()


# In[ ]:




