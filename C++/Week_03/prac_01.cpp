#include <iostream>
#include <vector>
#include <algorithm>
#include <map>
using namespace std;

int main()
{
    map<string,int> m;
    vector<char> v;
    for(auto &vv : v){
        cout <<vv;
    }
    auto sort2 = [](double arr[],int size){
        sort(arr[0],arr[size-1]);
    };
    m.insert({"a",0});
    m["b"] = 1;
}
template <typename T>
void insert(T a, T *b, int index)
{
    *(b+index) = a;
}