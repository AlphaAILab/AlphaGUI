#! python3
s = '''
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/0eC6fl06luXEYWpBSJvXCIX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/Fl4y0QdOxyyTHEGMXX8kcYX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/-L14Jk06m6pUHB-5mXQQnYX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/I3S1wsgSg9YCurV6PUkTOYX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/NYDWBdD4gIq26G5XYbHsFIX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/Pru33qjShpZSmG3z6VYwnYX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/Hgo13k-tfSpn0qi1SFdUfZBw1xU1rKptJj_0jans920.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/sTdaA6j0Psb920Vjv-mrzH-_kf6ByYO6CLYdB4HQE-Y.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/uYECMKoHcO9x1wdmbyHIm3-_kf6ByYO6CLYdB4HQE-Y.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/tnj4SB6DNbdaQnsM8CFqBX-_kf6ByYO6CLYdB4HQE-Y.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/_VYFx-s824kXq_Ul2BHqYH-_kf6ByYO6CLYdB4HQE-Y.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/NJ4vxlgWwWbEsv18dAhqnn-_kf6ByYO6CLYdB4HQE-Y.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/Ks_cVxiCiwUWVsFWFA3Bjn-_kf6ByYO6CLYdB4HQE-Y.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/oMMgfZMQthOryQo9n22dcuvvDin1pK8aKteLpeZ5c0A.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/ZLqKeelYbATG60EpZBSDy4X0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/oHi30kwQWvpCWqAhzHcCSIX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/rGvHdJnr2l75qb0YND9NyIX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/mx9Uck6uB63VIKFYnEMXrYX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/mbmhprMH69Zi6eEPBYVFhYX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/oOeFwZNlrTefzLYmlVV1UIX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/RxZJdnzeo3R5zSexge8UUZBw1xU1rKptJj_0jans920.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/77FXFjRbGzN4aCrSFhlh3oX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/isZ-wbCXNKAbnjo6_TwHToX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/UX6i4JxQDm3fVTc1CPuwqoX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/jSN2CGVDbcVyCnfJfjSdfIX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/PwZc-YbIL414wB9rB1IAPYX0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/97uahxiqZRoncBaCEI3aW4X0hVgzZQUfRDuZrPvH3D8.woff2)
https://fonts-gstatic.proxy.ustclug.org/s/roboto/v16/d-6IYplOFocCacKzxwXSOJBw1xU1rKptJj_0jans920.woff2)
'''

a = s.split()

b = [x[:-1] for x in a]

import os
for x in b:
	os.system('wget %s'%x)


