import urllib.request
import urllib.error
import json
import sys

BASE_URL = 'http://127.0.0.1:8000'
API_URL = f'{BASE_URL}/api'

def log(msg):
    print(f'[*] {msg}')

def req(url, method='GET', data=None):
    req = urllib.request.Request(url, method=method)
    if data:
        req.add_header('Content-Type', 'application/json')
        data = json.dumps(data).encode('utf-8')
    try:
        res = urllib.request.urlopen(req, data=data)
        body = res.read().decode('utf-8')
        try:
            return res.status, json.loads(body)
        except json.JSONDecodeError:
            return res.status, body
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body)
        except:
            return e.code, body

def test_api():
    # 1. Test Static files
    log('Testing Frontend Serving...')
    status, body = req(f'{BASE_URL}/itemmasterfile.html')
    if status != 200:
        print(f'ERROR: Frontend serving failed for itemmasterfile.html: {status}')
        sys.exit(1)
        
    status, body = req(f'{BASE_URL}/js/auth.js')
    if status != 200:
        print(f'ERROR: JS serving failed: {status}')
        sys.exit(1)

    # 2. Test Items API
    log('Testing API CRUD (Items)...')
    item_data = {'name': 'QA Test Item', 'description': 'QA Testing', 'status': 'Available', 'condition': 'New', 'category': 1}
    status, body = req(f'{API_URL}/items/', method='POST', data=item_data)
    if status != 201:
        print(f'ERROR: Item Create failed: {status} {body}')
        sys.exit(1)
    
    item_id = body['id']
    log(f'Created Item ID: {item_id}')
    
    # Read Item
    status, body = req(f'{API_URL}/items/{item_id}/')
    if status != 200:
        print(f'ERROR: Item Read failed: {status}')
        sys.exit(1)
        
    # Update Item
    update_data = {'name': 'QA Test Item Updated', 'status': 'Maintenance'}
    status, body = req(f'{API_URL}/items/{item_id}/', method='PATCH', data=update_data)
    if status != 200:
        print(f'ERROR: Item Update failed: {status} {body}')
        sys.exit(1)
        
    # Test Borrowing
    log('Testing Borrowing API...')
    borrow_data = {'item': item_id, 'expected_return_date': '2026-08-10'}
    status, body = req(f'{API_URL}/borrowings/', method='POST', data=borrow_data)
    if status != 201:
        print(f'ERROR: Borrowing Create failed: {status} {body}')
        sys.exit(1)
    borrow_id = body['id']
    log(f'Created Borrowing ID: {borrow_id}')
    
    # Delete Item (Should fail due to PROTECT from borrowing)
    status, body = req(f'{API_URL}/items/{item_id}/', method='DELETE')
    if status == 204:
        print('ERROR: Allowed deleting an item that is currently borrowed! Foreign Key PROTECT failure.')
        sys.exit(1)
    else:
        log('SUCCESS: Prevented deleting a borrowed item (FK constraint works)')
    
    # Delete Borrowing
    status, body = req(f'{API_URL}/borrowings/{borrow_id}/', method='DELETE')
    if status != 204:
        print(f'ERROR: Borrowing Delete failed: {status} {body}')
        sys.exit(1)
        
    # Delete Item (Now it should work)
    status, body = req(f'{API_URL}/items/{item_id}/', method='DELETE')
    if status != 204:
        print(f'ERROR: Item Delete failed: {status} {body}')
        sys.exit(1)

    log('All API tests passed!')

if __name__ == '__main__':
    test_api()
