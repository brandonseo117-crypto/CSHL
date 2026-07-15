import numpy as np
import dtale
import pandas as pd

neural_data = np.load(r"C:\Users\brand\Downloads\responses_211022.npy")
df = pd.DataFrame(neural_data)
d = dtale.show(df, host='localhost', subprocess=False)

print(d._main_url)
