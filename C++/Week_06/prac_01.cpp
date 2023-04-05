#include <iostream>
#include <string>
#include <cstdlib>
#include <ctime>

using namespace std;

void sort(int a[],int size);
void swap(int a[],int i,int j);

int main()
{
    srand(time(nullptr));
    int size;
    cout << "크기 입력 :";
    cin >> size;
    int *arr = new int[size];
    for(int i = 0; i < size; i++)
        arr[i] = rand()%90 + 10;
    sort(arr,size);
    for(int i = 0; i < size; i++)
        cout << arr[i] <<" ";
    return 0;
}
void sort(int a[],int size){
    for(int i = 0; i < size; i++)
    {
        for(int j = i+1; j < size; j++){
            if(a[i] < a[j])
                swap(a,i,j);
        }
    }
}
void swap(int a[], int i , int j){
    int temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}