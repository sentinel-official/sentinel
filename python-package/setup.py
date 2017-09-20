from setuptools import setup, find_packages
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

with open(path.join(here, 'README.rst'), encoding='utf-8') as f:
  long_description = f.read()

setup(
  name='sentinel',
  version='0.1.dev1',
  description='Sentinel network Python package',
  long_description=long_description,
  author='Tony Stark',
  author_email='ironman0x7b2@protonmail.com',
  classifiers=[
    'Development Status :: 3 - Alpha',
    'Intended Audience :: Developers',
    'Programming Language :: Python'
  ],
  keywords='sentinel',
  packages=find_packages(),
  package_data={
    'sentinel': ['genesis.json'],
  }
)
